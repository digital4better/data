const test = require('node:test');
const assert = require('node:assert/strict');
const { allocate, summarize, denominator } = require('../../scripts/cloud-allocation-study.cjs');
const { components, calculate } = require('../../scripts/cloud-embodied-audit.cjs');

function fixture(vcpus=16,memory=64,gpus=0) {
  const host={memory:1024,sockets:2,ssd:0,hdd:0,gpus,gpuMemory:gpus?80:0};
  return {vcpus,memory,accelerators:gpus?1:0,current:1.5079,host,extended:calculate(host,true),componentKg:components(host,true)};
}

test('allocation separates old-value allocation from host reconstruction and RAM allocation',()=>{
  const row=fixture(), result=allocate(row,{virtual:true},{vcpus:192});
  assert.equal(result.status,'simulated');
  assert.equal(result.shares.cpu,1/12);
  assert.equal(result.shares.ram,1/16);
  assert.ok(Math.abs(result.values.allocationOnlyCpu-row.current/12)<1e-12);
  assert.ok(Math.abs(result.values.recalculatedCpu-row.extended/12)<1e-12);
  assert.ok(Math.abs(result.values.recalculatedCpu-0.20816626666666668)<1e-12);
  assert.ok(result.values.recalculatedComponents<result.values.recalculatedCpu);
});

test('full host allocation conserves the impact and does not apply occupancy redistribution',()=>{
  const row=fixture(192,1024,8);
  row.accelerators=8;
  const r=allocate(row,{virtual:false},{vcpus:192});
  assert.equal(r.shares.cpu,1);
  assert.ok(Math.abs(r.values.recalculatedComponents-row.extended)<1e-12);
  assert.deepEqual(Object.values(r.occupancySensitivity),Array(3).fill(r.values.recalculatedComponents));
});

test('tenant component allocation conserves the host when all resources are allocated',()=>{
  const row=fixture(24,128,8);
  const before=JSON.stringify(row);
  const r=allocate(row,{virtual:true},{vcpus:192});
  assert.ok(Math.abs(r.values.recalculatedComponents*8-row.extended)<1e-12);
  assert.equal(JSON.stringify(row),before);
  const asym=allocate({...row,vcpus:12},{virtual:true},{vcpus:192});
  assert.ok(asym.values.recalculatedComponents>asym.values.recalculatedCpu);
});

test('missing and inconsistent host capacities cannot produce silent fallback allocations',()=>{
  const row=fixture();
  assert.equal(allocate(row,{virtual:true},null).status,'unknown-host-vcpus');
  assert.equal(allocate(row,{virtual:true},{vcpus:8}).status,'inconsistent-host-capacity');
  assert.equal(allocate({...row,partialAccelerator:true},{virtual:true},{vcpus:192}).status,'unsupported-host-or-accelerator');
  assert.equal(allocate({...row,memory:2048},{virtual:true},{vcpus:192}).status,'inconsistent-host-capacity');
  assert.equal(allocate(fixture(144,768),{virtual:true},{vcpus:192}).occupancySensitivity.allocatedCapacity50pct,null);
});

test('official Azure host capacity is paired with the selected host reference',()=>{
  const row={...fixture(),provider:'azure',reference:'azure-host-general-1'};
  const d=denominator(row,{virtual:true},{});
  assert.equal(d.vcpus,192);
  assert.equal(d.kind,'official-host-capacity');
  assert.match(d.source,/learn.microsoft.com/);
});

test('summary uses unweighted per-record medians and includes exclusions in coverage',()=>{
  const r=allocate(fixture(),{virtual:true},{vcpus:192});
  const s=summarize([r,{status:'unknown-host-vcpus'}]);
  assert.equal(s.total,2);
  assert.equal(s.simulated,1);
  assert.equal(s.unavailable,1);
  assert.equal(s.medianRecalculatedComponentsPercent,r.changePercent.recalculatedComponents);
});
