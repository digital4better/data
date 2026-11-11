const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { calculateHost, applyProfiles, profileValue, inputs } = require("../../scripts/cloud-embodied.cjs");

const root = path.resolve(__dirname, "../../data/cloud");
const providers = ["aws", "azure", "gcp", "oracle", "ovhcloud", "scaleway"];
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, `${name}.json`), "utf8"));
const base = { memory: 16, sockets: 1, ssd: 0, hdd: 0, gpus: 0, gpuMemory: 0 };

test("Teads arithmetic reproduces the original RAM coefficient without hourly or VM allocation", () => {
  assert.equal(calculateHost(base), 1);
  assert.equal(calculateHost({ ...base, memory: 32 }), 1.0221904);
  assert.equal(calculateHost({ ...base, memory: 512, sockets: 2 }), 1.7879024);
  assert.equal(calculateHost({ ...base, sockets: 2, ssd: 2, hdd: 1 }), 1.35);
});

test("GPU extension adds only memory beyond the explicit 16 GB reference", () => {
  assert.equal(calculateHost({ ...base, gpus: 1, gpuMemory: 16 }), 1.15);
  assert.equal(calculateHost({ ...base, gpus: 1, gpuMemory: 96 }), 1.260952);
  assert.equal(calculateHost({ ...base, gpus: 8, gpuMemory: 288 }), 5.2178944);
  for (const change of [{ gpus: 0.125 }, { sockets: 0 }, { ssd: 1.5 }, { memory: NaN }, { hdd: -1 }, { gpuMemory: 96 }]) {
    assert.throws(() => calculateHost({ ...base, ...change }));
  }
});

test("gap filling is explicit, non-mutating, idempotent and refuses conflicting values", () => {
  const profile = { provider: "test", ids: ["new"], host: base, sources: ["https://example.org"], assumptions: "Test host" };
  const records = { test: [{ id: "old", embodied: 2 }, { id: "new", memory: 4 }] };
  const filled = applyProfiles(records, [profile]);
  assert.deepEqual(records.test[1], { id: "new", memory: 4 });
  assert.equal(filled.test[1].embodied, 1);
  assert.equal(filled.test[0].embodied, 2);
  assert.deepEqual(applyProfiles(filled, [profile]), filled);
  assert.throws(() => applyProfiles({ test: [{ id: "new", embodied: 9 }] }, [profile]), /Refusing/);
  assert.throws(() => applyProfiles(records, [profile, profile]), /Duplicate/);
  assert.throws(() => applyProfiles(records, [{ ...profile, ids: ["unknown"] }]), /Missing target/);
  assert.throws(() => profileValue({ donor: "old", value: 3 }, records.test), /donor changed/);
});

test("archived gap-fill profiles reproduce their original proposal and retain provenance", () => {
  const catalogs = Object.fromEntries(providers.map((p) => [p, read(`${p}-vms`)]));
  for (const profile of inputs.profiles) for (const id of profile.ids) delete catalogs[profile.provider].find((r) => r.id === id).embodied;
  const proposal = applyProfiles(catalogs);
  assert.deepEqual(applyProfiles(proposal), proposal);
  const targets = new Set();
  for (const profile of inputs.profiles) {
    assert.ok(profile.assumptions.length > 20);
    assert.equal(new Set(profile.sources).size, profile.sources.length);
    for (const source of profile.sources) assert.equal(new URL(source).protocol, "https:");
    for (const id of profile.ids) {
      const key = `${profile.provider}/${id}`;
      assert.ok(!targets.has(key), key);
      targets.add(key);
      const record = proposal[profile.provider].find((r) => r.id === id);
      assert.ok(record, key);
      assert.equal(record.embodied, profileValue(profile, proposal[profile.provider]), key);
      assert.ok(!("estimated" in record), key);
      if (profile.host) assert.ok(profile.host.memory >= Number(String(record.memory).replace(",", ".")), key);
    }
  }
  for (const [p, records] of Object.entries(proposal)) for (const r of records) {
    assert.ok(Number.isFinite(r.embodied) && r.embodied > 0, `${p}/${r.id}`);
  }
});

test("cloud hardware references resolve, with distinct CPU and GPU variants", () => {
  const cpus = read("cpus"), accelerators = read("accelerators");
  const cpuIds = new Set(cpus.map((r) => r.id)), acceleratorIds = new Set(accelerators.map((r) => r.id));
  assert.equal(cpuIds.size, cpus.length);
  assert.equal(acceleratorIds.size, accelerators.length);
  for (const p of providers) for (const vm of read(`${p}-vms`)) {
    for (const id of Array.isArray(vm.cpu) ? vm.cpu : vm.cpu ? [vm.cpu] : []) assert.ok(cpuIds.has(id), `${p}/${vm.id}/${id}`);
    if (vm.accelerator) assert.ok(acceleratorIds.has(vm.accelerator), `${p}/${vm.id}/${vm.accelerator}`);
  }
  assert.equal(cpus.find((r) => r.id === "google-axion").platform, "neoverse v2");
  assert.equal(cpus.find((r) => r.id === "google-axion-n3").platform, "neoverse n3");
  assert.ok(!("tdp" in cpus.find((r) => r.id === "intel-xeon-6973pc")));
  assert.ok(!("cores" in cpus.find((r) => r.id === "amd-epyc-9004")));
  assert.equal(accelerators.find((r) => r.id === "nvidia-blackwell-b200-192").memory, 192);
  assert.equal(accelerators.find((r) => r.id === "nvidia-blackwell-b200").memory, 180);
  assert.equal(read("ovhcloud-vms").find((r) => r.id === "t2-180").accelerator, "nvidia-tesla-v100s32");
  assert.equal(read("gcp-vms").find((r) => r.id === "c4-standard-24").cpu[0], "intel-xeon-8581c");
  assert.equal(read("gcp-vms").find((r) => r.id === "c4-standard-24-lssd").cpu[0], "intel-xeon-6985pc");
});
