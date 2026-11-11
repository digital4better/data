const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const cp = require('node:child_process');
const { calculateHost, inputs } = require('./cloud-embodied.cjs');
const evidence = require('./cloud-embodied-audit-sources.json');

const root = path.resolve(__dirname, '..');
const providers = ['aws', 'azure', 'gcp', 'oracle', 'ovhcloud', 'scaleway'];
const canon = s => String(s).toLowerCase().replace(/^standard[_ -]?/, '').replace(/[^a-z0-9]/g, '');
const num = v => v == null || v === '' ? null : Number(String(v).replace(',', '.'));
const round = v => Number(v.toFixed(7));
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const unique = xs => [...new Set(xs)];
const zero = { memory: 16, sockets: 1, ssd: 0, hdd: 0, gpus: 0, gpuMemory: 0 };
const sourceUrls = {
  aws: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html',
  azure: 'https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/overview',
  gcp: 'https://docs.cloud.google.com/compute/docs/machine-resource',
  oracle: 'https://docs.oracle.com/en-us/iaas/Content/Compute/References/computeshapes.htm',
  ovhcloud: 'https://www.ovhcloud.com/en/public-cloud/prices/',
  scaleway: 'https://www.scaleway.com/en/docs/instances/reference-content/instances-datasheet/',
};

function comparison(value, calculated) {
  if (value == null || calculated == null) return { status: 'not-comparable', delta: null, percent: null };
  const delta = round(calculated - value), percent = round(100 * (calculated / value - 1));
  // Only recognize actual fine rounding, never round a multi-ton estimate to a placeholder integer.
  const precision = String(value).split('.')[1]?.length || 0;
  const status = Math.abs(delta) < 1e-7 ? 'exact'
    : precision >= 3 && Number(calculated.toFixed(precision)) === value ? 'rounding'
    : Math.abs(percent) <= 20 ? 'difference-up-to-20pct' : 'difference-over-20pct';
  return { status, delta, percent };
}

function components(host, extended = false) {
  const gpu = host.gpus * 150;
  const vram = extended ? host.gpus * Math.max(0, host.gpuMemory - 16) * 1.3869 : 0;
  return { base: 1000, ram: round(Math.max(0, host.memory - 16) * 1.3869), cpu: (host.sockets - 1) * 100,
    ssd: host.ssd * 100, hdd: host.hdd * 50, gpu, vram: round(vram), unit: 'kgCO2e' };
}

function calculate(host, extended = false) {
  return calculateHost({ ...host, gpuMemory: host.gpus ? extended ? host.gpuMemory : 16 : 0 });
}

function teadsReproduction(record) {
  const row = evidence.teads.find(x => x.name === record.name);
  if (!row) return null;
  const calculated = calculate(row.host);
  if (Math.abs(calculated * 1000 - row.cachedKg) > 0.001) throw Error(`Teads formula/cache mismatch: ${record.name}`);
  return { ...row, calculated, comparison: comparison(record.embodied, calculated),
    source: evidence.sources[0].url, limitation: 'Reproduction of original source assumptions, not verification of current physical hardware.' };
}

function cpuInfo(record, cpuMap) {
  return (Array.isArray(record.cpu) ? record.cpu : [record.cpu]).map(id => cpuMap.get(id)).filter(Boolean);
}

function grouping(provider, record) {
  // Several repository families aggregate physically different SKU generations.
  let family = provider === 'aws' ? record.name.split('.')[0] : record.family;
  if (provider === 'gcp' && /^(a2|a3)$/.test(family)) family = record.id.split('-').slice(0, 2).join('-');
  return `${family}|${record.accelerator || ''}|${JSON.stringify(record.cpu || [])}`;
}

function createContext(catalogs) {
  const cpus = new Map(JSON.parse(fs.readFileSync(path.join(root, 'data/cloud/cpus.json'))).map(x => [x.id, x]));
  const accelerators = new Map(JSON.parse(fs.readFileSync(path.join(root, 'data/cloud/accelerators.json'))).map(x => [x.id, x]));
  const profiles = new Map();
  for (const p of inputs.profiles) for (const id of p.ids) profiles.set(`${p.provider}/${canon(id)}`, p);
  return { cpus, accelerators, profiles, catalogs };
}

function physicalEvidence(provider, record, host) {
  let alternatives=[];
  if(provider==='gcp')alternatives=evidence.gcpNodes.filter(n=>n.id.startsWith(record.family+'-')&&n.memory>=num(record.memory)&&n.vcpus>=record.vcpus)
    .map(n=>({reference:n.id,memory:n.memory,sockets:n.sockets,source:n.source}));
  if(provider==='azure')alternatives=evidence.azureHosts.filter(h=>h.ids.includes(canon(record.id))&&h.memory>=num(record.memory))
    .map(h=>({reference:h.id,memory:h.memory,sockets:null,source:h.source}));
  if(provider==='aws')alternatives=evidence.awsHosts.filter(h=>h.family===record.name.split('.')[0]&&h.cores>=8&&h.cores>=record.vcpus/2)
    .map(h=>({reference:h.family,memory:null,sockets:h.sockets,source:'https://aws.amazon.com/ec2/dedicated-hosts/pricing/'}));
  const warnings=[];
  const socketCounts=unique(alternatives.map(h=>h.sockets).filter(n=>n!=null));
  if(host&&socketCounts.length&&!socketCounts.includes(host.sockets))warnings.push('Selected socket count differs from all documented compatible dedicated-host options; other hosting configurations may exist.');
  const memories=alternatives.map(h=>h.memory).filter(n=>n!=null);
  if(host&&memories.length&&host.memory<Math.min(...memories))warnings.push('Selected host RAM is below every documented compatible dedicated-host option. This challenges the proxy, not necessarily the ordinary VM fleet.');
  return {alternatives,warnings};
}

function resolveHost(provider, record, ctx, reproduction) {
  if (provider === 'aws' && record.id.startsWith('mac')) return { basis: 'out-of-scope', reason: 'Apple desktop hardware is outside the commodity rack-server baseline.' };
  if (provider === 'scaleway' && ['function', 'container'].includes(record.family)) return { basis: 'unresolved-service-host', reason: 'Serverless allocation does not describe the physical host. No host size is invented.' };
  if (provider === 'azure' && ['sv1', 'sv2'].includes(record.family)) return { basis: 'unresolved-service-host', reason: 'Service tier lacks a verified physical-host mapping.' };
  if (provider === 'aws' && record.family === 'ultrawarm1') return { basis: 'unresolved-service-host', reason: 'Managed service host topology is not documented in the audited sources.' };

  const accelerator = ctx.accelerators.get(record.accelerator);
  const partialAccelerator = num(record.accelerators) > 0 && accelerator?.type !== 'gpu';
  const gpuMemory = accelerator?.memory || 0;
  const cpus = cpuInfo(record, ctx.cpus);
  const arm = cpus.length > 0 && cpus.every(c => /arm/i.test(c.architecture));
  const assumption = [], sources = [], alternatives = [];
  let host, basis, reference;
  const profile = ctx.profiles.get(`${provider}/${canon(record.id)}`);
  if (reproduction) {
    host = { ...reproduction.host, gpuMemory: reproduction.host.gpus ? gpuMemory : 0 };
    basis = 'teads-source-reconstruction'; reference = `EC2 Instances Dataset!${reproduction.cell}`;
    sources.push(reproduction.source);
    assumption.push('Original Teads host inputs, not reverse-engineered from the stored embodied value. Source configurations are historical estimates.');
  } else if (provider === 'gcp' && /^x[45]-.*-metal$/.test(record.id)) {
    const threads = record.id.startsWith('x4-') ? 120 : 172;
    host = { ...zero, memory: num(record.memory), sockets: record.vcpus / threads };
    basis = 'documented-host-reconstruction'; reference = record.id;
    sources.push('https://docs.cloud.google.com/compute/docs/memory-optimized-machines', 'https://docs.cloud.google.com/compute/docs/cpu-platforms');
    assumption.push(`Bare-metal RAM; socket count inferred from ${threads} threads per documented CPU. Extra interconnect hardware omitted by Teads.`);
  } else if (profile?.host) {
    host = { ...profile.host }; basis = 'explicit-refresh-scenario'; reference = profile.ids[0];
    assumption.push(profile.assumptions, 'Existing draft modeling inputs: equality for newly filled entries is a reproducibility check, not independent validation.');
    sources.push(...profile.sources);
  }

  const peers = ctx.catalogs[provider].filter(r => grouping(provider, r) === grouping(provider, record));
  const largest = peers.toSorted((a,b) => num(b.memory)-num(a.memory) || b.vcpus-a.vcpus)[0];
  if (!host && provider === 'oracle') {
    const direct = evidence.oracle[canon(record.name)];
    const dedicated = evidence.oracleHosts.find(h => canon(record.shape || record.name).startsWith(canon(h.supported.split(' ')[0])) && h.memory >= num(record.memory));
    const bm = ctx.catalogs.oracle.find(r => r.virtual === false && r.family === record.family.replace(/flex$/, ''));
    const parent = bm && evidence.oracle[canon(bm.name)];
    const spec = direct || parent;
    if (spec || dedicated) {
      const referenceCpus = cpuInfo(bm || record, ctx.cpus);
      const coreCount = referenceCpus[0]?.cores;
      const ocpus = dedicated?.ocpus || spec.ocpus;
      let sockets = coreCount ? Math.ceil(ocpus / coreCount) : arm ? 1 : 2;
      sockets = Math.max(1, sockets);
      host = { ...zero, memory: dedicated?.memory || spec.memory, sockets,
        ssd: spec?.ssd ?? (num(record.ssd) > 0 ? 1 : 0),
        gpus: accelerator?.type === 'gpu' ? Math.ceil(num((bm || record).accelerators) || 0) : 0, gpuMemory: accelerator?.type === 'gpu' ? gpuMemory : 0 };
      basis = direct ? 'documented-host-reconstruction' : dedicated ? 'documented-host-proxy' : 'family-bare-metal-proxy';
      reference = dedicated?.id || spec.name; sources.push(sourceUrls.oracle);
      assumption.push('CPU sockets inferred from OCPU and catalog CPU core count; review custom/disabled cores. Published bare-metal or dedicated-host RAM and drive count where available.');
      if (!direct) assumption.push('Same-generation bare-metal/dedicated server is a hosting proxy; ordinary VM placement is not guaranteed.');
      if (spec?.ssd == null && num(record.ssd) > 0) assumption.push('One local physical SSD assumed because count is unavailable.');
      if (record.id === 'bm-gpu-gb200-4') host.gpuMemory = 192;
      if (record.id === 'bm-gpu-gb300-4') host.gpuMemory = 278;
      if (record.id === 'bm-gpu-b300-8') host.gpuMemory = 263;
    }
  }

  if (!host && provider === 'aws') {
    const exactFamily = record.name.split('.')[0];
    const known = Object.entries(evidence.aws).filter(([name,s]) => name.split('.')[0] === exactFamily && Number.isFinite(s.memory));
    const metal = known.filter(([name,s]) => name.includes('.metal') && s.memory >= num(record.memory) && s.vcpus >= record.vcpus).sort((a,b) => a[1].memory-b[1].memory || a[1].vcpus-b[1].vcpus);
    const selected = record.virtual === false && evidence.aws[record.name]?.memory ? [record.name,evidence.aws[record.name]]
      : metal[0] || known.sort((a,b) => b[1].vcpus-a[1].vcpus || b[1].memory-a[1].memory)[0];
    if (selected) {
      const [name,spec] = selected;
      const familyHost = evidence.awsHosts.filter(h => h.family === exactFamily && h.cores >= 8 && h.cores * (arm ? 1 : 2) >= spec.vcpus).sort((a,b)=>a.cores-b.cores)[0];
      const perSocket = Math.max(...cpus.map(c=>c.threads || c.cores || 0),0);
      const sockets = familyHost?.sockets || (perSocket ? Math.ceil(spec.vcpus/perSocket) : arm ? 1 : 2);
      const parent = ctx.catalogs.aws.find(r=>r.name===name) || largest;
      host = { ...zero, memory: spec.memory, sockets: Math.max(1,sockets),
        ssd: spec.ssd ?? (num(parent.ssd)>0 ? 1 : 0), hdd: spec.hdd ?? (num(parent.hdd)>0 ? 1 : 0),
        gpus: accelerator?.type==='gpu' ? Math.ceil(num(parent.accelerators)||0) : 0, gpuMemory: accelerator?.type==='gpu' ? gpuMemory : 0 };
      basis = record.virtual===false ? 'documented-host-reconstruction' : 'family-bare-metal-proxy'; reference=name;
      sources.push(...spec.sources);
      if(familyHost)sources.push('https://aws.amazon.com/ec2/dedicated-hosts/pricing/');
      assumption.push(familyHost ? 'Socket count from compatible Dedicated Host family.' : 'Socket count inferred from CPU catalog capacity, or one Arm/two x86 sockets if unknown.');
      assumption.push(record.virtual===false ? 'Bare-metal exposed resources proxy the full host.' : 'Smallest compatible bare-metal size, else largest published family size, proxies the complete host. Same-host placement and installed RAM overhead remain assumptions.');
      if(spec.ssd==null && num(parent.ssd)>0)assumption.push('Physical local-drive count unknown: one SSD assumed.');
    }
  }

  if (!host && provider === 'azure') {
    const hosts=evidence.azureHosts.filter(h=>h.ids.includes(canon(record.id))&&h.memory>=num(record.memory));
    if(hosts.length){
      const choices=hosts.map(h=>{
        const cores=Math.max(...cpus.map(c=>c.cores||0),0);
        const sockets=cores?Math.max(1,Math.ceil(h.cores/cores)):arm?1:2;
        const local=peers.some(r=>num(r.ssd)>0);
        return {reference:h.id,host:{...zero,memory:h.memory,sockets,ssd:local?1:0},source:h.source};
      }).sort((a,b)=>calculate(a.host)-calculate(b.host));
      const selected=choices[0];host=selected.host;reference=selected.reference;basis='documented-host-proxy';
      sources.push(...choices.map(x=>x.source));alternatives.push(...choices.map(c=>({reference:c.reference,host:c.host,original:calculate(c.host)})));
      assumption.push('Published Dedicated Host available RAM is a proxy, not guaranteed installed RAM. Several compatible host generations are retained as alternatives. Lowest modeled compatible host selected without looking at embodied.');
      assumption.push('Socket count inferred from physical cores and catalog CPU. One physical SSD assumed for families exposing local storage; virtual disk count is not physical inventory.');
    }
  }

  if (!host && provider === 'gcp') {
    let nodes=evidence.gcpNodes.filter(n=>n.id.startsWith(record.family+'-')&&n.memory>=num(record.memory)&&n.vcpus>=record.vcpus);
    if (/^(a2|a3)$/.test(record.family))nodes=nodes.filter(n=>n.id.startsWith(record.id.split('-').slice(0,2).join('-')));
    const wantsLocal=/-lssd|lssd-/.test(record.id);
    const localNodes=nodes.filter(n=>n.id.includes('lssd')===wantsLocal);
    if(localNodes.length)nodes=localNodes;
    if(nodes.length){
      const choices=nodes.map(n=>({reference:n.id,host:{...zero,memory:n.memory,sockets:n.sockets,
        ssd:wantsLocal||num(record.ssd)>0?1:0,gpus:accelerator?.type==='gpu'?Math.ceil(num(largest.accelerators)||0):0,gpuMemory:accelerator?.type==='gpu'?gpuMemory:0},source:n.source}));
      choices.sort((a,b)=>Math.abs(a.host.memory/nodes.find(n=>n.id===a.reference).vcpus-num(record.memory)/record.vcpus)-Math.abs(b.host.memory/nodes.find(n=>n.id===b.reference).vcpus-num(record.memory)/record.vcpus));
      const selected=choices[0];host=selected.host;reference=selected.reference;basis='documented-host-proxy';sources.push(selected.source);
      alternatives.push(...choices.map(c=>({reference:c.reference,host:c.host,original:calculate(c.host)})));
      assumption.push('Official sole-tenant socket count and available RAM; closest memory/vCPU ratio among fitting nodes selected, independently of embodied. Ordinary VM placement and reserved RAM remain unknown.');
      if(host.ssd)assumption.push('One physical SSD is a conservative storage assumption. Exposed Local SSD partitions are not counted as physical drives.');
      if(host.gpus)assumption.push('GPU count from the largest same-accelerator family SKU; full-host placement assumed.');
    }
  }

  if(!host){
    const parent=record.virtual===false?record:largest;
    const perSocket=Math.max(...cpuInfo(parent,ctx.cpus).map(c=>c.threads||c.cores||0),0);
    host={...zero,memory:Math.max(16,num(parent.memory)),sockets:perSocket?Math.max(1,Math.ceil(parent.vcpus/perSocket)):arm?1:2,
      ssd:num(parent.ssd)>0?1:0,hdd:num(parent.hdd)>0?1:0,gpus:accelerator?.type==='gpu'?Math.ceil(num(parent.accelerators)||0):0,gpuMemory:accelerator?.type==='gpu'?gpuMemory:0};
    basis='catalog-family-scenario';reference=parent.id;sources.push(sourceUrls[provider]);
    assumption.push('Illustrative scenario only: largest same-family, CPU and accelerator catalog SKU represents the host. Not independently verified physical inventory.');
    assumption.push('RAM is exposed RAM, sockets inferred from catalog CPU threads (else one Arm/two x86). One drive per present local storage type assumed. Do not adopt automatically.');
  }
  if(profile?.donor)assumption.push(`Draft inherited donor ${profile.donor}; this audit does not use its embodied value as a calculation input.`);
  if(partialAccelerator)assumption.push('NON-GPU ACCELERATOR: Teads has no calibrated ASIC/FPGA factor. CPU/RAM/storage subtotal is not a complete host estimate.');
  const invalid=[];
  if(host.memory<num(record.memory))invalid.push('modeled-host-memory-below-guest');
  if(accelerator?.type==='gpu'&&host.gpus<Math.ceil(num(record.accelerators)||0))invalid.push('modeled-host-gpus-below-guest');
  if(host.gpus&&!host.gpuMemory)invalid.push('gpu-memory-unknown');
  // These stress cases expose sensitivity; they are not probabilistic bounds or confidence intervals.
  const sensitivity = basis==='teads-source-reconstruction'||basis==='documented-host-reconstruction' ? null : {
    label:'Illustrative sensitivity, not confidence interval: +25% RAM, +1 socket, and +1 local SSD if present; GPU count unchanged.',
    original:calculate({...host,memory:host.memory*1.25,sockets:host.sockets+1,ssd:host.ssd?host.ssd+1:0}),
    extended:calculate({...host,memory:host.memory*1.25,sockets:host.sockets+1,ssd:host.ssd?host.ssd+1:0},true)
  };
  return {host,basis,reference,assumptions:assumption,sources:unique(sources),alternatives,sensitivity,invalid,partialAccelerator};
}

function buildAudit(catalogs, baseline, baselineCommit) {
  const ctx=createContext(catalogs),rows=[];
  for(const provider of providers){
    const previous=new Map(baseline[provider].map(r=>[r.id,r]));
    for(const record of catalogs[provider]){
      const old=previous.get(record.id),historical=old?.embodied??null;
      if(historical!==null&&record.embodied!==historical)throw Error(`Historical embodied changed: ${provider}/${record.id}`);
      const repro=provider==='aws'?teadsReproduction(record):null;
      const resolved=resolveHost(provider,record,ctx,repro);
      const a=ctx.accelerators.get(record.accelerator);
      const minimumHost={...zero,memory:Math.max(16,num(record.memory)),ssd:num(record.ssd)>0?1:0,hdd:num(record.hdd)>0?1:0,gpus:a?.type==='gpu'?Math.ceil(num(record.accelerators)||0):0,gpuMemory:a?.type==='gpu'?a.memory||0:0};
      const minimum=resolved.basis==='out-of-scope'||resolved.basis==='unresolved-service-host'?null:calculate(minimumHost);
      const original=resolved.host?calculate(resolved.host):null,extended=resolved.host?calculate(resolved.host,true):null;
      const official=provider==='aws'?evidence.aws[record.name]:provider==='azure'?evidence.azure[canon(record.id)]:provider==='gcp'?evidence.gcp[record.id]:provider==='oracle'?evidence.oracle[canon(record.name)]:evidence[provider]?.[canon(record.id)];
      const hardwareDifferences=[];
      if(official?.memory!=null&&official.memory!==num(record.memory))hardwareDifferences.push({field:'memory',catalog:record.memory,official:official.memory,sources:official.sources});
      if(official?.vcpus!=null&&official.vcpus!==record.vcpus)hardwareDifferences.push({field:'vcpus',catalog:record.vcpus,official:official.vcpus,sources:official.sources});
      // AWS G3 counts M60 GPU chips; this catalog counts dual-GPU 16 GB M60 boards.
      const officialAccelerators=official?.accelerators==null?null:provider==='aws'&&record.accelerator==='nvidia-tesla-m60'?official.accelerators/2:official.accelerators;
      if(officialAccelerators!=null&&Math.abs(officialAccelerators-num(record.accelerators))>1e-8)hardwareDifferences.push({field:'accelerators',catalog:record.accelerators,official:officialAccelerators,sources:official.sources});
      const partial=resolved.partialAccelerator||resolved.invalid?.length>0;
      const row={provider,id:record.id,name:record.name,family:record.family,population:historical==null?'newly-filled':'historical',historical,current:record.embodied,
        memory:num(record.memory),vcpus:record.vcpus,accelerator:record.accelerator||null,accelerators:num(record.accelerators)||0,
        ...resolved,original,extended,componentKg:resolved.host?components(resolved.host,true):null,
        historicalComparison:comparison(historical,partial?null:original),currentComparison:comparison(record.embodied,partial?null:extended),
        historicalSourceReproduction:repro,minimum,belowMinimum:minimum!=null&&record.embodied+0.0001<minimum,
        belowMinimumOver20pct:minimum!=null&&minimum>record.embodied*1.2+0.0001,hardwareDifferences,
        officialSpecCoverage:official?.memory!=null,officialSpecSources:official?.sources||[],physicalEvidence:physicalEvidence(provider,record,resolved.host)};
      row.action=resolved.basis==='out-of-scope'?'separate-method-required':resolved.basis==='unresolved-service-host'?'host-mapping-required'
        :partial?'resolve-model-inputs':hardwareDifferences.length?'review-hardware-first':row.belowMinimum?'reconstruct-before-correction'
        :repro?.comparison.status==='exact'?'preserve-source-consistent-value'
        :['exact','rounding'].includes(row.historicalComparison.status)?'preserve-pending-host-validation':'review-host-assumptions';
      rows.push(row);
    }
    for(const old of baseline[provider])if(!catalogs[provider].some(r=>r.id===old.id))throw Error(`Lost historical identifier: ${provider}/${old.id}`);
  }
  const counts=rs=>{
      const n={total:rs.length,historical:0,newlyFilled:0,exact:0,rounding:0,within20:0,over20:0,notComparable:0,sourceExact:0,belowMinimum:0,hardwareDifferences:0,officialSpecCoverage:0,hostWarnings:0};
    for(const r of rs){
      if(r.population==='historical'){
        n.historical++;
        const key={exact:'exact',rounding:'rounding','difference-up-to-20pct':'within20','difference-over-20pct':'over20','not-comparable':'notComparable'}[r.historicalComparison.status];n[key]++;
        if(r.historicalSourceReproduction?.comparison.status==='exact')n.sourceExact++;
      }else n.newlyFilled++;
      if(r.belowMinimum)n.belowMinimum++;
      if(r.hardwareDifferences.length)n.hardwareDifferences++;
      if(r.officialSpecCoverage)n.officialSpecCoverage++;
      if(r.physicalEvidence.warnings.length)n.hostWarnings++;
    }
    return n;
  };
  const summary=Object.fromEntries(providers.map(p=>[p,counts(rows.filter(r=>r.provider===p))]));
  const overlaps=[];
  for(const provider of providers){
    const groups=Object.groupBy(rows.filter(r=>r.provider===provider),r=>canon(r.id));
    for(const matches of Object.values(groups))if(matches.length>1)overlaps.push({provider,ids:matches.map(r=>r.id),values:matches.map(r=>r.current),differentValues:Math.max(...matches.map(r=>r.current))-Math.min(...matches.map(r=>r.current))>.0001});
  }
  const families=Object.entries(Object.groupBy(rows,r=>r.provider+'/'+r.family)).map(([family,rs])=>({family,...counts(rs),bases:unique(rs.map(r=>r.basis))}));
  return {baselineCommit,methodology:{unit:'tCO2e per complete physical host',coefficients:{base:1000,additionalRamPerGB:1.3869,additionalSocket:100,ssd:100,hdd:50,gpu:150},gpuExtension:'Local assumption: +1.3869 kg per GB VRAM above 16 GB per GPU.',allocation:'None: no VM share, service lifetime or hourly conversion.',scope:'Every catalog record is classified, including non-VM services and Apple exceptions. Complete source-backed host inventories are not available for every SKU.',comparison:'Historical values compared to original flat-GPU Teads; draft values compared to the local GPU extension. Invalid or partial models are not classified as matches.',noCircularValidation:'Stored embodied values are never used to infer RAM, sockets or drive counts. Refresh profiles are explicitly identified as internal reproducibility, not independent evidence.',sourceReproduction:'Original-sheet reproduction is reported separately, including the historical Mac/FPGA calculation where present; it does not endorse applying the rack/GPU method there.',sensitivity:'Host alternatives and a +25% RAM/+1 socket/local-drive stress case are exploratory, not statistical confidence bounds.',limitations:['Native GB/GiB numerical convention preserved.','Cloud host available RAM can differ from installed RAM.','Exposed local disk volumes may be physical drive partitions.','Core/thread-based socket counts can be wrong for custom CPUs or reserved/disabled cores.','No Boavizta factors. No records removed. No production values changed.']},attribution:evidence.attribution,summary,totals:counts(rows),families,overlaps,sources:evidence.sources,rows};
}

function main(){
  const destination=path.resolve(process.argv[2]||path.join(root,'reports/cloud-embodied-2026-11-11'));
  if(destination===path.join(root,'data')||destination.startsWith(path.join(root,'data')+path.sep))throw Error('Audit output must stay outside public datasets');
  const baselineCommit=cp.execFileSync('git',['rev-parse','--verify',`${process.argv[3]||'HEAD'}^{commit}`],{cwd:root,encoding:'utf8'}).trim();
  const catalogs={},baseline={},hashes={};
  for(const provider of providers){const file=`data/cloud/${provider}-vms.json`;const text=fs.readFileSync(path.join(root,file));hashes[file]=sha(text);catalogs[provider]=JSON.parse(text);baseline[provider]=JSON.parse(cp.execFileSync('git',['show',`${baselineCommit}:${file}`],{cwd:root,encoding:'utf8',maxBuffer:10*1024*1024}));}
  const audit=buildAudit(catalogs,baseline,baselineCommit);
  audit.inputHashes=hashes;
  audit.modelInputsHash=sha(fs.readFileSync(path.join(__dirname,'cloud-embodied-inputs.json')));
  audit.evidenceHash=sha(fs.readFileSync(path.join(__dirname,'cloud-embodied-audit-sources.json')));
  for(const [file,hash]of Object.entries(hashes))if(sha(fs.readFileSync(path.join(root,file)))!==hash)throw Error('Dataset changed during audit');
  fs.mkdirSync(destination,{recursive:true});
  fs.writeFileSync(path.join(destination,'audit.json'),JSON.stringify(audit,null,2)+'\n');
  require('./cloud-embodied-audit-report.cjs').render(audit,destination);
  console.log(JSON.stringify({destination,totals:audit.totals,providers:audit.summary,bases:Object.fromEntries(Object.entries(Object.groupBy(audit.rows,r=>r.basis)).map(([k,v])=>[k,v.length])),overlaps:audit.overlaps.length},null,2));
  return audit;
}

if(require.main===module)main();
module.exports={buildAudit,comparison,components,calculate,canon,main};
