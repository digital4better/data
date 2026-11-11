// One-time, explicit migration preparation. Normal checks use the pinned input file, never HEAD.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const {buildAudit,canon}=require('./cloud-embodied-audit.cjs');
const {denominator}=require('./cloud-allocation-study.cjs');
const evidence=require('./cloud-embodied-audit-sources.json');
const {inputs:refresh}=require('./cloud-embodied.cjs');
const {providers,calculateHost,allocate}=require('./cloud-hosts.cjs');
const {normalizeHost}=require('./cloud-host-assumptions.cjs');
const root=path.resolve(__dirname,'..');
const num=n=>Number(String(n??0).replace(',','.'));
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const digest=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0,10);

function packingSnapshots(directory) {
  const result={};
  for(const key of ['azure-host-general','azure-host-memory','azure-host-compute']){
    const html=fs.readFileSync(path.join(directory,key+'.html'),'utf8');
    const tables=JSON.parse(fs.readFileSync(path.join(directory,key+'.tables.json')));
    let heading='',index=0;
    const names=[];
    for(const m of html.matchAll(/<(h3|table)\b[^>]*>([\s\S]*?)<\/\1>/g)){
      if(m[1]==='h3')heading=m[2].replace(/<[^>]*>/g,'').trim();
      else names[index++]=heading;
    }
    tables.forEach((table,i)=>{
      const known=evidence.azureHosts.find(h=>h.id===`${key}-${i}`);
      if(!known)return;
      const limits={};
      for(const row of table.slice(1))if(row[3]&&/^\d+$/.test(row[4]||''))limits[canon(row[3])]=Number(row[4]);
      const name=names[i];
      if(!name || !/type\d/i.test(name))throw Error(`Missing official host name ${key}/${i}`);
      result[known.id]={name,id:`azure-${slug(name)}`,limits,source:known.source,snapshotSha256:crypto.createHash('sha256').update(html).digest('hex')};
    });
  }
  return result;
}

function prepare(directory) {
  const output=path.join(__dirname,'cloud-host-inputs.json');
  if(fs.existsSync(output))throw Error('Pinned inputs already exist; review explicit edits instead of replacing the migration baseline');
  const baselineCommit=cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
  const catalogs={},baseline={},legacyEmbodied={};
  for(const p of providers){const file=`data/cloud/${p}-vms.json`;catalogs[p]=JSON.parse(fs.readFileSync(path.join(root,file)));baseline[p]=JSON.parse(cp.execFileSync('git',['show',`${baselineCommit}:${file}`],{cwd:root,encoding:'utf8',maxBuffer:1e7}));const old=new Map(baseline[p].map(r=>[r.id,r]));for(const r of catalogs[p])legacyEmbodied[`${p}/${r.id}`]=old.get(r.id)?.embodied??null;}
  const audit=buildAudit(catalogs,baseline,baselineCommit),packing=packingSnapshots(directory);
  const cpus=new Map(JSON.parse(fs.readFileSync(path.join(root,'data/cloud/cpus.json'))).map(c=>[c.id,c]));
  const accelerators=new Map(JSON.parse(fs.readFileSync(path.join(root,'data/cloud/accelerators.json'))).map(c=>[c.id,c]));
  const profileMap=new Map(),assignments=[];
  const rawProfiles=[];
  for(const row of audit.rows){
    const vm=catalogs[row.provider].find(r=>r.id===row.id),cpu=Array.isArray(vm.cpu)?vm.cpu:vm.cpu?[vm.cpu]:[];
    const accelerator=accelerators.get(vm.accelerator);
    const profile=refresh.profiles.find(p=>p.provider===row.provider&&p.ids.some(id=>canon(id)===canon(vm.id)));
    const notes=[...(row.assumptions||[])].filter(s=>!s.includes('Draft inherited donor')&&!s.includes('NON-GPU ACCELERATOR')&&!s.includes('Existing draft modeling inputs')).map(s=>s.replace(' Lowest modeled compatible host selected without looking at embodied.',''));
    let raw=row.host&&{...row.host},basis=row.basis,reference=row.reference;
    let capacity=row.host?denominator(row,vm,catalogs):null;
    const familyPeers=catalogs[row.provider].filter(r=>r.family===vm.family&&r.accelerator===vm.accelerator&&JSON.stringify(r.cpu)===JSON.stringify(vm.cpu));
    const profilePeers=profile?.host?catalogs[row.provider].filter(r=>profile.ids.includes(r.id)&&r.accelerator===vm.accelerator):familyPeers;
    const largest=(profilePeers.length?profilePeers:familyPeers).toSorted((a,b)=>b.vcpus-a.vcpus||num(b.memory)-num(a.memory))[0]||vm;
    if(!raw){
      raw={memory:Math.max(16,num(vm.memory)),sockets:1,ssd:num(vm.ssd)>0?1:0,hdd:num(vm.hdd)>0?1:0,gpus:Math.ceil(num(vm.accelerators)),gpuMemory:accelerator?.memory||0};
      basis=row.basis==='out-of-scope'?'desktop-rack-equivalent':'dedicated-equivalent-fallback';
      reference=vm.id;
      capacity={vcpus:Math.max(1,vm.vcpus),kind:'dedicated-equivalent-fallback'};
      notes.push('Unknown physical mapping: a dedicated-equivalent envelope is assumed and allocated 100%. This is a conservative fallback, not evidence of a dedicated deployment.');
      if(basis==='desktop-rack-equivalent')notes.push('Apple desktop is deliberately modeled with the same 1000 kg rack-equivalent base; not an Apple product LCA. The proxy is conservative by policy, not a proven upper bound.');
      if(vm.vcpus>128)raw.sockets=Math.ceil(vm.vcpus/128);
    }
    if(!capacity){
      capacity={vcpus:Math.max(vm.vcpus,largest.vcpus),kind:'profile-largest-size-proxy'};
      notes.push(`Allocatable host vCPU capacity assumed equal to largest matching profile size ${largest.id}; no multiplication by CPU SMT or vNUMA.`);
    }
    // When a non-GPU board exists, do not silently publish a CPU/RAM-only total.
    if(num(vm.accelerators)>0){
      raw.gpus=Math.max(raw.gpus,Math.ceil(num(largest.accelerators)),Math.ceil(num(vm.accelerators)));
      raw.gpuMemory=Math.max(raw.gpuMemory,accelerator?.memory||0);
      if(accelerator?.type!=='gpu')notes.push('D4B non-GPU extension: 150 kg per accelerator plus the memory proxy above 16 GB, also for ASIC/FPGA. Not a measured chip/board LCA; catalog accelerator quantities are treated as board equivalents.');
      if(!raw.gpuMemory){raw.gpuMemory=16;notes.push('Unpublished accelerator memory: 16 GB modeling placeholder, not a verified hardware capacity.');}
    }
    const parent=catalogs[row.provider].find(r=>r.id===reference||r.name===reference);
    const parentIsEnvelope=parent&&(parent.virtual===false||(parent.vcpus===capacity.vcpus&&Math.max(16,num(parent.memory))===raw.memory));
    const base={provider:row.provider,name:reference||`${vm.family} profile`,basis,method:'d4b-host-v1',vcpus:Math.max(vm.vcpus,capacity.vcpus),memory:Math.max(raw.memory,num(vm.memory)),sockets:raw.sockets,cpu,
      ssd_count:raw.ssd,hdd_count:raw.hdd,
      ...(parentIsEnvelope&&num(parent.ssd)>0?{ssd_capacity:num(parent.ssd)}:{}),...(parentIsEnvelope&&num(parent.hdd)>0?{hdd_capacity:num(parent.hdd)}:{}),
      ...(num(vm.accelerators)>0?{accelerator:vm.accelerator}:{}),accelerators:raw.gpus,accelerator_memory:raw.gpuMemory,
      sources:[...new Set([...(row.sources||[]),...(profile?.sources||[]),...(capacity.source?[capacity.source]:[]),...(!row.sources?.length?[row.provider==='aws'?'https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html':row.provider==='azure'?'https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/overview':'https://www.scaleway.com/en/docs/instances/reference-content/instances-datasheet/']:[])])],assumptions:notes};
    for(const key of ['ssd','hdd'])if(base[`${key}_capacity`]!=null)base[`${key}_capacity`]=Math.max(base[`${key}_capacity`],num(vm[key]));
    if(basis==='catalog-family-scenario')notes.push('Largest catalog size is a modeling proxy, not a verified physical server. No provider-global guarantee.');
    if(num(vm.ssd)>0&&!base.ssd_count){base.ssd_count=1;notes.push('One local SSD assumed; capacity and actual physical drive count are not established.');}
    if(num(vm.hdd)>0&&!base.hdd_count){base.hdd_count=1;notes.push('One local HDD assumed; capacity and actual physical drive count are not established.');}
    const candidates=[{host:base,reference,limit:packing[reference]?.limits[canon(vm.id)]}];
    if(vm.virtual!==false&&row.provider==='azure'&&!base.accelerators){
      for(const h of evidence.azureHosts.filter(h=>h.ids.includes(canon(vm.id))&&h.memory>=num(vm.memory)&&h.vcpus>=vm.vcpus)){
        const maxCores=Math.max(0,...cpu.map(id=>cpus.get(id)?.cores||0));
        candidates.push({reference:h.id,limit:packing[h.id]?.limits[canon(vm.id)],host:{...base,name:packing[h.id].name,basis:'documented-host-proxy',memory:h.memory,vcpus:h.vcpus,sockets:maxCores?Math.max(1,Math.ceil(h.cores/maxCores)):2,ssd_capacity:undefined,hdd_capacity:undefined,
          sources:[h.source],assumptions:['Published Dedicated Host available RAM and vCPU capacity proxy the physical host. Ordinary VM placement is not guaranteed.','Sockets inferred from host cores and the VM CPU reference, or two sockets if unknown; CPU alternatives do not establish actual host identity.','A local temporary disk is not a verified physical disk inventory; drive counts remain modeled.']}});
      }
    }
    if(vm.virtual!==false&&row.provider==='gcp'&&!base.accelerators){
      for(const h of evidence.gcpNodes.filter(h=>h.id.startsWith(vm.family+'-')&&h.memory>=num(vm.memory)&&h.vcpus>=vm.vcpus)){
        candidates.push({reference:h.id,host:{...base,name:h.id,basis:'documented-host-proxy',memory:h.memory,vcpus:h.vcpus,sockets:h.sockets,ssd_capacity:undefined,hdd_capacity:undefined,sources:[h.source],assumptions:['Published sole-tenant capacity and sockets used as a host proxy, not proof of ordinary VM placement.','Local physical storage count remains a modeled assumption, not the number of Local SSD partitions.']}});
      }
    }
    if(vm.virtual!==false&&row.provider==='aws'){
      const matches=evidence.awsHosts.filter(h=>h.family===vm.name.split('.')[0]&&h.cores>=8&&h.cores>=(vm.vcpus/2));
      for(const h of matches)candidates.push({reference,host:{...base,sockets:h.sockets,sources:[...new Set([...base.sources,'https://aws.amazon.com/ec2/dedicated-hosts/pricing/'])],assumptions:[...notes,'Socket count from the documented Dedicated Host family; allocatable capacity and ordinary hosting remain profile assumptions.']}});
    }
    const options=candidates.map(c=>{const h={...c.host,embodied:calculateHost(c.host)};try{return {...c,host:h,allocation:allocate(vm,h,c.limit)};}catch{return null;}}).filter(Boolean);
    options.sort((a,b)=>b.allocation.embodied_allocated-a.allocation.embodied_allocated||JSON.stringify(a.host).localeCompare(JSON.stringify(b.host)));
    if(!options.length)throw Error(`No compatible host ${row.provider}/${vm.id}`);
    const chosen=options[0];
    const h=chosen.host;
    if(row.provider==='azure'&&h.basis==='documented-host-proxy')delete h.cpu;
    else h.assumptions.push('CPU references are model inputs inherited from the compatible instance profile; they are not a verified physical-host inventory.');
    const name=packing[chosen.reference]?.name||(h.basis==='teads-source-reconstruction'?`${vm.family} Teads host profile`:h.name);
    const stem=packing[chosen.reference]?.id||`${row.provider}-${slug(name).slice(0,70)}`;
    const identity={...h,assumptions:undefined,sources:undefined,embodied:undefined,name:undefined};
    const signature=digest(identity);
    let id=`${stem}-${signature}`;
    if(stem==='azure-dsv6-type1'&&h.sockets===2&&h.ssd_count===0)id=stem;
    const existing=profileMap.get(id);
    if(existing&&digest({...existing,assumptions:undefined,sources:undefined,embodied:undefined,name:undefined,id:undefined})!==signature)throw Error(`Host identity collision ${id}`);
    const stored={id,...h,name,embodied:h.embodied};
    stored.assumptions=[...new Set([...(existing?.assumptions||[]),...h.assumptions,'Selected by highest allocated impact among the explicitly compatible modeled candidates. This is not a physical upper bound or observed fleet occupancy.'])];
    stored.sources=[...new Set([...(existing?.sources||[]),...h.sources])];
    profileMap.set(id,stored);
    assignments.push({provider:row.provider,id:vm.id,host:id,...(chosen.limit?{published_limit:chosen.limit}:{}),capacity_basis:capacity.kind});
    rawProfiles.push({key:`${row.provider}/${vm.id}`,host_basis:h.basis,options:options.length,new_value:chosen.allocation.embodied_allocated,old_value:legacyEmbodied[`${row.provider}/${vm.id}`]});
  }
  const result={method:'d4b-host-v1',legacyBaselineCommit:baselineCommit,attribution:evidence.attribution,allocation:'Maximum homogeneous packing constrained by CPU, RAM, accelerators, known local storage capacity and documented placement limits; all residual capacity attributed to tenants. Select highest per-instance result among coherent candidate hosts. Unknown services and Apple use explicit dedicated-equivalent fallbacks.',legacyEmbodied,azurePacking:packing,profiles:[...profileMap.values()].sort((a,b)=>a.id.localeCompare(b.id)),assignments};
  const ids=new Map(result.profiles.map(h=>[h.id,normalizeHost(h).id]));
  result.profiles=result.profiles.map(normalizeHost);
  result.assignments.forEach(a=>{a.host=ids.get(a.host);});
  fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
  const report=path.join(root,'reports/cloud-host-migration');fs.mkdirSync(report,{recursive:true});fs.writeFileSync(path.join(report,'preparation.json'),JSON.stringify(rawProfiles,null,2)+'\n');
  console.log(JSON.stringify({profiles:result.profiles.length,assignments:assignments.length,legacyPreserved:Object.values(legacyEmbodied).filter(v=>v!=null).length,legacyFilled:Object.values(legacyEmbodied).filter(v=>v==null).length,bases:Object.fromEntries(Object.entries(Object.groupBy(rawProfiles,r=>r.host_basis)).map(([k,rs])=>[k,rs.length]))},null,2));
}
if(require.main===module)prepare(process.argv[2]||'/tmp/cloud-refresh-20261110');
module.exports={packingSnapshots};
