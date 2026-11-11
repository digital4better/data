const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const { buildAudit, comparison, calculate, components } = require('../../scripts/cloud-embodied-audit.cjs');
const root=path.resolve(__dirname,'../..');
const providers=['aws','azure','gcp','oracle','ovhcloud','scaleway'];
const catalogs=Object.fromEntries(providers.map(p=>[p,JSON.parse(fs.readFileSync(path.join(root,`data/cloud/${p}-vms.json`)))]));
const baseline=Object.fromEntries(providers.map(p=>[p,JSON.parse(cp.execFileSync('git',['show',`HEAD:data/cloud/${p}-vms.json`],{cwd:root,encoding:'utf8',maxBuffer:10*1024*1024}))]));
const audit=buildAudit(catalogs,baseline,'test');

test('every catalog identifier appears exactly once and comparison categories reconcile',()=>{
  const ids=providers.flatMap(p=>catalogs[p].map(r=>p+'/'+r.id)).sort();
  assert.deepEqual(audit.rows.map(r=>r.provider+'/'+r.id).sort(),ids);
  assert.equal(new Set(ids).size,ids.length);
  for(const s of Object.values(audit.summary)){
    assert.equal(s.total,s.historical+s.newlyFilled);
    assert.equal(s.historical,s.exact+s.rounding+s.within20+s.over20+s.notComparable);
  }
});

test('historical source reconstruction is recalculated, not copied from embodied',()=>{
  const a=audit.rows.find(r=>r.id==='a1-metal'&&r.provider==='aws');
  assert.equal(a.original,1.0221904);
  assert.equal(a.historicalSourceReproduction.comparison.status,'exact');
  const d=audit.rows.find(r=>r.id==='dc2-large'&&r.provider==='aws');
  assert.equal(d.historicalSourceReproduction.calculated,1.8162132);
  assert.notEqual(d.historicalSourceReproduction.calculated,d.current);
});

test('rounding never turns integer placeholders or missing values into verified matches',()=>{
  assert.equal(comparison(1,1.4).status,'difference-over-20pct');
  assert.equal(comparison(6.7586,6.758552).status,'rounding');
  assert.equal(comparison(null,1).status,'not-comparable');
  assert.equal(comparison(1,null).status,'not-comparable');
});

test('unsupported host types and non-GPU accelerators do not produce complete-host matches',()=>{
  for(const r of audit.rows.filter(r=>r.basis==='out-of-scope'||r.basis==='unresolved-service-host'||r.partialAccelerator||r.invalid?.length)){
    assert.equal(r.historicalComparison.status,'not-comparable');
    assert.equal(r.currentComparison.status,'not-comparable');
  }
});

test('GPU board units and fractional rounding are normalized before hardware warnings',()=>{
  for(const id of ['g3-4xlarge','g3-8xlarge','g3-16xlarge','nv12ads-a10-v5','nv4ads-v710-v5']){
    const r=audit.rows.find(r=>r.id===id);
    assert.ok(r);
    assert.ok(!r.hardwareDifferences.some(d=>d.field==='accelerators'));
  }
  const p=audit.rows.find(r=>r.id==='p6e-gb200-36xlarge');
  assert.ok(!p.hardwareDifferences.some(d=>d.field==='accelerators'));
  const regression=structuredClone(catalogs);
  regression.aws.find(r=>r.id==='p6e-gb200-36xlarge').accelerators=36;
  const warning=buildAudit(regression,baseline,'test').rows.find(r=>r.id==='p6e-gb200-36xlarge');
  assert.equal(warning.hardwareDifferences.find(d=>d.field==='accelerators').official,4);
});

test('component totals reconcile, comparisons stay finite, and sources accompany every model',()=>{
  for(const r of audit.rows){
    if(!r.host)continue;
    assert.ok(r.sources.length&&r.assumptions.length);
    const c=components(r.host,true);
    const sum=Object.entries(c).filter(([k])=>k!=='unit').reduce((s,[,v])=>s+v,0)/1000;
    assert.ok(Math.abs(sum-r.extended)<1e-7);
    assert.equal(calculate(r.host),r.original);
    assert.ok(Number.isFinite(r.original)&&r.original>=1);
    assert.ok(Number.isFinite(r.extended)&&r.extended>=r.original);
    assert.ok(r.historicalComparison.percent===null||Number.isFinite(r.historicalComparison.percent));
  }
});

test('audit is non-mutating and rejects changed or removed historical records',()=>{
  const before=JSON.stringify(catalogs);
  const second=buildAudit(catalogs,baseline,'test');
  assert.equal(JSON.stringify(catalogs),before);
  assert.deepEqual(second,audit);
  const changed=structuredClone(catalogs);
  const old=baseline.aws.find(r=>r.embodied!=null);
  changed.aws.find(r=>r.id===old.id).embodied+=1;
  assert.throws(()=>buildAudit(changed,baseline,'test'),/Historical embodied changed/);
  changed.aws=changed.aws.filter(r=>r.id!==old.id);
  assert.throws(()=>buildAudit(changed,baseline,'test'),/Lost historical identifier/);
});

test('draft donor values are not reused as independent calculated evidence',()=>{
  const { inputs, profileValue }=require('../../scripts/cloud-embodied.cjs');
  for(const id of ['p5-4xlarge','g4-standard-24','pop2-48c-192g','i7ie-metal-48xl']){
    const r=audit.rows.find(r=>r.id===id);
    assert.ok(r.host);
    const profile=inputs.profiles.find(p=>p.provider===r.provider&&p.ids.includes(id));
    assert.notEqual(r.extended,profileValue(profile,catalogs[r.provider]));
  }
});
