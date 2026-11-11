const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {generate,calculateHost,allocate,providers,hostHeaders,vmHeaders}=require('../../scripts/cloud-hosts.cjs');
const inputs=require('../../scripts/cloud-host-inputs.json');
const {definitions,normalizeHost}=require('../../scripts/cloud-host-assumptions.cjs');
require('ts-node').register({transpileOnly:true,compilerOptions:{module:'CommonJS'}});
const {parseCsv}=require('../src/data.ts');
const root=path.resolve(__dirname,'../../data/cloud');
const read=(p,k)=>JSON.parse(fs.readFileSync(path.join(root,`${p}-${k}.json`)));
const catalogs=Object.fromEntries(providers.map(p=>[p,read(p,'vms')]));

test('all instances resolve a same-provider host and have complete allocated and legacy impacts',()=>{
  const keys=[];
  for(const p of providers){
    const hosts=read(p,'hosts'),map=new Map(hosts.map(h=>[h.id,h]));
    assert.equal(map.size,hosts.length);
    assert.deepEqual(hosts.map(h=>h.id),hosts.map(h=>h.id).sort((a,b)=>a.localeCompare(b)));
    for(const h of hosts){
      assert.equal(h.provider,p);
      assert.equal(h.method,'d4b-host-v1');
      assert.equal(h.embodied,calculateHost(h));
      assert.ok(h.sources.length&&h.assumptions.length);
      assert.doesNotMatch(JSON.stringify({...h,sources:undefined}),/teads/i);
      assert.deepEqual(normalizeHost(h),h);
      for(const code of h.assumptions){
        assert.ok(Object.hasOwn(definitions,code),code);
        assert.ok(fs.readFileSync(path.join(root,'README.md'),'utf8').includes('`'+code+'`'),code);
      }
      for(const u of h.sources)assert.equal(new URL(u).protocol,'https:');
      assert.ok(catalogs[p].some(v=>v.host===h.id));
    }
    for(const v of catalogs[p]){
      const key=`${p}/${v.id}`,h=map.get(v.host);keys.push(key);
      assert.ok(h,key);
      assert.ok(Number.isFinite(v.embodied)&&v.embodied>0,key);
      assert.ok(Number.isFinite(v.embodied_allocated)&&v.embodied_allocated>0,key);
      assert.ok(!Object.hasOwn(v,'host_share'),key);
      assert.ok(Number.isInteger(v.host_instances)&&v.host_instances>=1,key);
      assert.ok(Math.abs(v.embodied_allocated-h.embodied/v.host_instances)<=1e-10,key);
      if(v.virtual===false)assert.equal(v.host_instances,1,key);
      const legacy=inputs.legacyEmbodied[key];
      assert.equal(v.embodied,legacy??v.embodied_allocated,key);
    }
  }
  assert.deepEqual(keys.sort(),Object.keys(inputs.legacyEmbodied).sort());
});

test('generation is deterministic, idempotent and preserves every existing record field',()=>{
  const before=JSON.stringify(catalogs),r=generate(catalogs,inputs);
  assert.equal(JSON.stringify(catalogs),before);
  assert.deepEqual(r.vms,catalogs);
  assert.deepEqual(generate(r.vms,inputs),r);
  for(const p of providers)assert.deepEqual(r.hosts[p],read(p,'hosts'));
  const changed=structuredClone(catalogs);
  const [key,legacy]=Object.entries(inputs.legacyEmbodied).find(([,v])=>v!=null);
  const [p,id]=key.split('/');changed[p].find(v=>v.id===id).embodied=legacy+1;
  assert.throws(()=>generate(changed,inputs),/historical change/);
  const broken=structuredClone(inputs);broken.assignments[0].host='missing';
  assert.throws(()=>generate(catalogs,broken),/Missing host/);
});

test('Azure documented placement limits allocate residual capacity instead of only vCPU share',()=>{
  const hosts=read('azure','hosts'),h=hosts.find(h=>h.id==='azure-dsv6-type1');
  assert.equal(h.vcpus,192);assert.equal(h.memory,1024);
  const small=catalogs.azure.find(v=>v.id==='d2s-v6'),medium=catalogs.azure.find(v=>v.id==='d16s-v6');
  assert.equal(small.host,h.id);assert.equal(small.host_instances,32);
  assert.equal(small.embodied_allocated,0.07806235);
  assert.equal(medium.host_instances,12);
  assert.ok(small.embodied_allocated>h.embodied*2/192);
  assert.equal(small.embodied,1.4329);
});

test('packing respects RAM, physical accelerator fractions, storage and published limits',()=>{
  const h={id:'h',vcpus:192,memory:1024,accelerators:8,accelerator:'gpu',ssd_capacity:8000,embodied:8};
  const v={id:'v',virtual:true,vcpus:4,memory:16,accelerators:1,accelerator:'gpu',ssd:1000};
  assert.equal(allocate(v,h).host_instances,8);
  assert.equal(allocate({...v,accelerators:0.5,ssd:0},h).host_instances,16);
  assert.equal(allocate(v,h,4).host_instances,4);
  assert.equal(allocate({...v,memory:512},h).host_instances,2);
  assert.equal(allocate({...v,virtual:false},h).host_instances,1);
  assert.throws(()=>allocate({...v,vcpus:256},h),/smaller/);
  assert.throws(()=>allocate(v,h,0),/placement/);
});

test('fallback profiles and non-GPU coefficients are explicit and never silently zeroed',()=>{
  const all=providers.flatMap(p=>read(p,'hosts'));
  for(const h of all.filter(h=>['dedicated-equivalent-fallback','desktop-rack-equivalent'].includes(h.basis))){
    assert.ok(h.assumptions.some(s=>s.includes('fallback')));
    for(const v of catalogs[h.provider].filter(v=>v.host===h.id))assert.equal(v.host_instances,1);
  }
  const h={id:'test',vcpus:32,memory:16,sockets:1,ssd_count:0,hdd_count:0,accelerators:1,accelerator_memory:32};
  assert.equal(calculateHost(h),1.1721904);
});

test('provider host and VM CSVs are flat and agree with every JSON record',()=>{
  for(const p of providers)for(const kind of ['hosts','vms']){
    const [header,...rows]=parseCsv(fs.readFileSync(path.join(root,`${p}-${kind}.csv`),'utf8'));
    assert.deepEqual(header,kind==='hosts'?hostHeaders:vmHeaders);
    const records=read(p,kind);assert.equal(rows.length,records.length);
    records.forEach((r,i)=>assert.deepEqual(rows[i],header.map(k=>r[k]==null?'':kind==='hosts'&&['sources','assumptions'].includes(k)?r[k].join(' | '):String(r[k])),`${p}/${r.id}`));
    if(kind==='vms')for(const row of rows)for(const field of ['embodied','embodied_allocated'])assert.ok(Number(row[header.indexOf(field)])>0);
  }
});

test('generation removes the redundant host share without altering other fields',()=>{
  const previous=structuredClone(catalogs);
  for(const rows of Object.values(previous))for(const vm of rows)vm.host_share=1/vm.host_instances;
  const result=generate(previous,inputs);
  assert.deepEqual(result.vms,catalogs);
  assert.ok(Object.hasOwn(previous.aws[0],'host_share'));
  assert.ok(!Object.hasOwn(allocate({id:'v',vcpus:1,memory:16},{id:'h',vcpus:2,memory:32,embodied:1}),'host_share'));
});
