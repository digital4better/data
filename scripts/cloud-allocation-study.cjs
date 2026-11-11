const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const { buildAudit, canon } = require('./cloud-embodied-audit.cjs');
const evidence = require('./cloud-embodied-audit-sources.json');
const { inputs } = require('./cloud-embodied.cjs');
const root = path.resolve(__dirname, '..');
const providers = ['aws', 'azure', 'gcp', 'oracle', 'ovhcloud', 'scaleway'];
const numeric = n => Number(String(n).replace(',', '.'));
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const pct = (value, previous) => 100 * (value / previous - 1);
const median = values => {
  const v = values.toSorted((a,b) => a-b), m = Math.floor(v.length/2);
  return v.length ? v.length%2 ? v[m] : (v[m-1]+v[m])/2 : null;
};

function denominator(row, record, catalogs) {
  if (record.virtual === false) return { vcpus: record.vcpus, kind: 'whole-physical-machine', source: row.sources?.[0] };
  if (row.historicalSourceReproduction) return {
    vcpus: row.historicalSourceReproduction.platformVcpus, kind: 'historical-teads-platform', source: row.historicalSourceReproduction.source,
  };
  if (row.provider === 'azure') {
    const host = evidence.azureHosts.find(h => h.id === row.reference);
    if (host) return { vcpus: host.vcpus, kind: 'official-host-capacity', source: host.source };
  }
  if (row.provider === 'gcp') {
    const host = evidence.gcpNodes.find(h => h.id === row.reference);
    if (host) return { vcpus: host.vcpus, kind: 'official-host-capacity', source: host.source };
  }
  if (row.provider === 'oracle') {
    const host = evidence.oracleHosts.find(h => h.id === row.reference);
    if (host && record.ocpus > 0) return {
      vcpus: host.ocpus * record.vcpus / record.ocpus, kind: 'official-host-capacity', source: host.source,
      note: 'OCPU ratio is preserved using this shape\'s vCPU/OCPU relationship; no universal x2 assumption.',
    };
  }
  const peers = catalogs[row.provider];
  if (row.basis === 'explicit-refresh-scenario') {
    const profile = inputs.profiles.find(p => p.provider === row.provider && p.ids.some(id => canon(id) === canon(record.id)));
    const candidates = peers.filter(r => profile?.ids.includes(r.id) && numeric(r.memory) === row.host.memory && r.accelerator === record.accelerator);
    const selected = candidates.toSorted((a,b) => b.vcpus-a.vcpus)[0];
    if (selected) return { vcpus: selected.vcpus, kind: 'profile-largest-size-proxy', reference: selected.id, source: row.sources[0] };
    return null;
  }
  const parent = peers.find(r => r.id === row.reference || r.name === row.reference);
  // Pair the allocation denominator with the same RAM profile used in the host calculation.
  if (parent && Math.max(16,numeric(parent.memory)) === row.host.memory) return {
    vcpus: parent.vcpus, kind: parent.virtual === false ? 'bare-metal-capacity-proxy' : 'catalog-largest-size-proxy',
    reference: parent.id, source: row.sources[0],
  };
  return null;
}

function allocate(row, record, capacity) {
  if (!row.host || row.invalid?.length || row.partialAccelerator) return { status: 'unsupported-host-or-accelerator' };
  if (!capacity || !Number.isFinite(capacity.vcpus) || capacity.vcpus <= 0) return { status: 'unknown-host-vcpus' };
  const full = record.virtual === false;
  const shares = { cpu: full ? 1 : row.vcpus/capacity.vcpus, ram: full ? 1 : row.memory/row.host.memory,
    gpu: full ? 1 : row.host.gpus ? row.accelerators/row.host.gpus : 0 };
  if (Object.values(shares).some(s => !Number.isFinite(s) || s < 0 || s > 1+1e-8)) return { status: 'inconsistent-host-capacity', capacity, shares };
  for (const k of Object.keys(shares)) shares[k] = Math.min(1,shares[k]);
  const c = row.componentKg;
  const component = ((c.base+c.cpu+c.ssd+c.hdd)*shares.cpu+c.ram*shares.ram+(c.gpu+c.vram)*shares.gpu)/1000;
  const cpu = row.extended*shares.cpu;
  const componentShare = component/row.extended;
  const atOccupancy = q => full ? component : Math.max(shares.cpu,shares.ram,shares.gpu)>q ? null : component/q;
  const values = {
    allocationOnlyCpu: row.current*shares.cpu,
    allocationOnlyComponents: row.current*componentShare,
    recalculatedCpu: cpu,
    recalculatedComponents: component,
  };
  return { status: 'simulated', capacity, shares, componentShare, values,
    changePercent: Object.fromEntries(Object.entries(values).map(([k,v]) => [k,pct(v,row.current)])),
    componentVsCpuPercent: pct(component,cpu),
    // Occupancy sensitivity only, not an asserted utilization rate or a deployment recommendation.
    occupancySensitivity: { full: component, allocatedCapacity75pct: atOccupancy(0.75), allocatedCapacity50pct: atOccupancy(0.5) },
  };
}

function summarize(rows) {
  const sim = rows.filter(r => r.status === 'simulated');
  const change = sim.map(r => r.changePercent.recalculatedComponents);
  return { total: rows.length, simulated: sim.length, unavailable: rows.length-sim.length,
    decreases: change.filter(n => n < -0.01).length, unchanged: change.filter(n => Math.abs(n)<=0.01).length,
    increases: change.filter(n => n > 0.01).length,
    medianAllocationOnlyCpuPercent: median(sim.map(r=>r.changePercent.allocationOnlyCpu)),
    medianAllocationOnlyComponentsPercent: median(sim.map(r=>r.changePercent.allocationOnlyComponents)),
    medianRecalculatedCpuPercent: median(sim.map(r=>r.changePercent.recalculatedCpu)),
    medianRecalculatedComponentsPercent: median(change),
    belowHalfCurrent: change.filter(n=>n<=-50).length,
    aboveDoubleCurrent: change.filter(n=>n>=100).length,
  };
}

function study(audit, catalogs) {
  const rows = audit.rows.map(row => {
    const record = catalogs[row.provider].find(r=>r.id===row.id);
    const capacity = row.host ? denominator(row,record,catalogs) : null;
    return { provider: row.provider, id: row.id, virtual: record.virtual, current: row.current,
      population: row.population, host: row.host, hostBasis: row.basis, hostReference: row.reference,
      hostOriginal: row.original, hostExtended: row.extended, componentKg: row.componentKg,
      hostWarnings: row.physicalEvidence.warnings, hardwareDifferences: row.hardwareDifferences,
      hostAssumptions: row.assumptions, sources: [...new Set([...(row.sources||[]),...(capacity?.source?[capacity.source]:[])])],
      ...allocate(row,record,capacity),
    };
  });
  const group = fn => Object.fromEntries(Object.entries(Object.groupBy(rows,fn)).map(([k,rs])=>[k,summarize(rs)]));
  const azurePackingIllustrations = [['d2s-v6',32],['d16s-v6',12],['d32s-v6',6],['d96s-v6',2]].map(([id,maxVMs])=>{
    const r=rows.find(r=>r.provider==='azure'&&r.id===id);
    return {id,maxVMs,current:r.current,cpuAllocated:r.values.recalculatedCpu,componentAllocated:r.values.recalculatedComponents,
      homogeneousHostFullyAttributed:r.hostExtended/maxVMs,
      assumption:'Alternative: maximum homogeneous packing on Dsv6-Type1 and all residual host capacity redistributed equally. Not actual shared-fleet occupancy.',
      source:'https://learn.microsoft.com/en-us/azure/virtual-machines/dedicated-hosts/general-purpose-skus#dsv6'};
  });
  return { baselineCommit: audit.baselineCommit, attribution: audit.attribution,
    methodology: {
      unit: 'tCO2e per VM reservation over the full modeled host lifetime; not an hourly footprint.',
      scope: 'Read-only simulation. Current means working catalog after hardware corrections, including pending embodied gap fills. No production dataset or public schema is changed.',
      cpuAllocation: 'Multiply total host impact by reserved VM vCPUs / modeled host vCPUs. No CPU workload utilization factor.',
      componentAllocation: 'Base (including its first 16 GB RAM), additional sockets and local drives use CPU share; extra RAM uses RAM share; GPU plus VRAM uses GPU share. This allocation is a local proposal, not a Teads-certified rule.',
      allocationOnly: 'Apply CPU share, or the modeled weighted component share, to the current stored value. This isolates allocation numerically but does not validate that the old value described the same host.',
      recalculated: 'Reconstruct the host using the earlier Teads audit and its local GPU extension, then allocate it.',
      capacity: 'Use the same selected host reference. No socket-to-thread guessing or silent capping of impossible ratios. Unknown denominators remain excluded; largest-size proxies are marked as assumptions.',
      conservation: 'Component shares conserve each component if total tenant allocations do not exceed host resources. Idle/reserved capacity is not reassigned. Dedicated-host homogeneous packing limits may prevent full capacity allocation.',
      occupancy: '75% and 50% sensitivities are hypothetical allocated-capacity ratios, not observed utilization. Dividing by them assumes idle capacity is redistributed to tenants; do not apply to whole-host reservations.',
      statistics: 'Unweighted medians across SKU records, not customer usage, total emissions or a provider market-weighted footprint. No sums across interchangeable catalog SKUs.',
      warnings: 'Official capacity does not verify every host component or actual placement. Profile warnings and source assumptions remain visible. Historical serverless, Apple and non-GPU accelerators need separate treatment.',
      migration: 'Changing embodied from host impact to VM-allocated impact is a semantic breaking change, not an ordinary data refresh. Preserve an explicit host value and allocation metadata or introduce a distinct VM-impact field before publication.',
    }, summary: summarize(rows), providers: group(r=>r.provider), capacities: group(r=>r.capacity?.kind||r.status),
    classes: group(r=>r.virtual===false?'bare-metal':r.virtual!==true?'virtuality-unspecified':r.host?.gpus?'gpu-vm':'cpu-vm'),
    azurePackingIllustrations, rows,
  };
}

function render(result,destination) {
  const esc = v => String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const f = v => !Number.isFinite(v)?'Non disponible':new Intl.NumberFormat('fr-FR',{maximumFractionDigits:2}).format(v);
  const table = (head,rows) => '<div class="scroll"><table><thead><tr>'+head.map(x=>'<th>'+esc(x)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map(x=>'<td>'+esc(x)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  const examples = [['azure','d2s-v6'],['azure','d16s-v6'],['azure','d32s-v6'],['azure','d96s-v6'],['aws','m5-large'],['aws','g5-xlarge'],['gcp','n2-standard-2'],['oracle','bm-gpu-h100-8']].map(([p,id])=>result.rows.find(r=>r.provider===p&&r.id===id)).filter(Boolean);
  const html = '<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Simulation allocation embodied</title><style>body{background:#f6f4ed;color:#203a32;font:17px/1.6 Georgia,serif;margin:0}main{max-width:1200px;margin:auto;padding:24px}h1{font-size:36px}h2{margin-top:32px}.scroll{overflow:auto}table{border-collapse:collapse;background:white;width:100%;font:13px/1.5 Verdana,sans-serif}td,th{padding:12px;border-bottom:1px solid #ccd3cc;text-align:left}th{background:#e2e9df}a{color:#205e51}.notice{padding:16px;background:#fff1d5;border-left:4px solid #a56a30}li{margin:12px 0}code{overflow-wrap:anywhere}p{max-width:95ch}</style><main><h1>Allocation de la fabrication aux VM</h1><p>Simulation du 11 novembre 2026. Aucune modification des datasets. Les valeurs actuelles sont celles du brouillon local apres correction materielle, pas necessairement celles publiees.</p><p class="notice">'+result.summary.simulated+' references simulables sur '+result.summary.total+'. Les autres restent non calculables. Mediane par reference, sans ponderation d\'usage : ce n\'est pas une baisse mesuree des emissions de Fruggr.</p><h2>Deux effets distincts</h2><p>Allocation seule : conserver le montant actuel, puis le repartir. Recalcul + allocation : reconstruire le serveur, puis le repartir. Une hausse reste possible lorsqu\'une ancienne valeur de serveur etait fortement sous-evaluee.</p>'+table(['Provider','References','Simulees','Allocation seule CPU, mediane %','Recalcul + CPU, mediane %','Recalcul + composants, mediane %','Baisses','Hausses'],Object.entries(result.providers).map(([p,s])=>[p,s.total,s.simulated,f(s.medianAllocationOnlyCpuPercent),f(s.medianRecalculatedCpuPercent),f(s.medianRecalculatedComponentsPercent),s.decreases,s.increases]))+'<h2>Exemples (kgCO2e)</h2>'+table(['Reference','Actuel','Allocation seule CPU','Recalcul + CPU','Recalcul + composants','Ecart composants %'],examples.map(r=>[r.provider+'/'+r.id,f(r.current*1000),f(r.values?.allocationOnlyCpu*1000),f(r.values?.recalculatedCpu*1000),f(r.values?.recalculatedComponents*1000),f(r.changePercent?.recalculatedComponents)]))+'<h2>Origine des denominateurs</h2>'+table(['Base','References simulees','Ecart composants median %'],Object.entries(result.capacities).map(([k,s])=>[k,s.simulated,f(s.medianRecalculatedComponentsPercent)]))+'<h2>Hypotheses et limites</h2><p>La part CPU correspond aux ressources reservees, pas au taux de charge. Le scenario par composants alloue le socle/CPU/disques par vCPU, la RAM supplementaire par RAM, et les GPU/VRAM par cartes allouees. Aucun amortissement temporel n\'est applique.</p><p>La capacite inutilisee n\'est pas redistribuee dans le scenario central. Le JSON contient des sensibilites a 75 % / 50 % d\'allocation de capacite, sans affirmer que ces taux sont observes. Le maximum de VM par hote peut limiter le remplissage : Azure annonce par exemple seulement 32 D2s_v6 sur 192 vCPU. Une allocation 2/192 ne signifie donc pas que 96 de ces VM sont deployables.</p><p>Les scenarios issus de la plus grande taille du catalogue, les hypotheses d\'hote deja contestees et les variantes GPU restent experimentaux. Ne pas remplacer automatiquement les valeurs. Les reservations bare metal restent a 100 %.</p><h2>Resultats reproductibles</h2><p><a href="allocation.json">Toutes les references, valeurs, fractions, exclusions et sources (JSON)</a>. Les sources et hypotheses de chaque ligne accompagnent son resultat.</p><p>Passer de l\'impact d\'un hote a celui d\'une VM change le sens du champ : prevoir un champ distinct ou une migration explicite, pas un remplacement silencieux.</p><h2>Sources</h2><ul>'+[...new Set(examples.flatMap(r=>r.sources))].map(u=>'<li><a href="'+esc(u)+'">'+esc(u)+'</a></li>').join('')+'</ul></main></html>';
  const packing = '<h2>Sensibilite au remplissage Azure (kgCO2e)</h2><p>Autre politique : attribuer tout le serveur aux VM presentes, y compris les ressources inutilisees. Le scenario ci-dessous suppose le maximum de VM identiques autorise sur Dsv6-Type1, pas une occupation mesuree.</p>'+table(['Reference','VM max / hote','Part CPU','Part composants','Hote entier reparti'],result.azurePackingIllustrations.map(r=>[r.id,r.maxVMs,f(r.cpuAllocated*1000),f(r.componentAllocated*1000),f(r.homogeneousHostFullyAttributed*1000)]))+'<p><a href="https://learn.microsoft.com/en-us/azure/virtual-machines/dedicated-hosts/general-purpose-skus#dsv6">Capacites et limites de placement Microsoft</a>. Le nombre de sockets reste une hypothese du calcul de l\'hote.</p><p>'+esc(result.attribution)+'</p>';
  fs.writeFileSync(path.join(destination,'report.html'),html.replace('</style>','*{box-sizing:border-box}a{overflow-wrap:anywhere}</style>').replace('</main>',packing+'</main>'));
}

function main() {
  const destination=path.resolve(process.argv[2]||path.join(root,'reports/cloud-allocation-2026-11-11'));
  if(destination===path.join(root,'data')||destination.startsWith(path.join(root,'data')+path.sep))throw Error('Study must remain outside published data');
  const baselineCommit=cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
  const catalogs={},baseline={},hashes={};
  for(const p of providers){const file=`data/cloud/${p}-vms.json`,b=fs.readFileSync(path.join(root,file));hashes[file]=hash(b);catalogs[p]=JSON.parse(b);baseline[p]=JSON.parse(cp.execFileSync('git',['show',`${baselineCommit}:${file}`],{cwd:root,encoding:'utf8',maxBuffer:10*1024*1024}));}
  const result=study(buildAudit(catalogs,baseline,baselineCommit),catalogs);
  result.inputHashes=hashes;
  result.evidenceHash=hash(fs.readFileSync(path.join(__dirname,'cloud-embodied-audit-sources.json')));
  result.profilesHash=hash(fs.readFileSync(path.join(__dirname,'cloud-embodied-inputs.json')));
  for(const [file,h]of Object.entries(hashes))if(hash(fs.readFileSync(path.join(root,file)))!==h)throw Error('Dataset changed');
  fs.mkdirSync(destination,{recursive:true});
  fs.writeFileSync(path.join(destination,'allocation.json'),JSON.stringify(result,null,2)+'\n');
  render(result,destination);
  console.log(JSON.stringify({destination,summary:result.summary,providers:result.providers,capacities:result.capacities,classes:result.classes},null,2));
}
if(require.main===module)main();
module.exports={denominator,allocate,summarize,study};
