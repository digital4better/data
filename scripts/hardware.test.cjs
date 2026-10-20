const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { csv, normalizeCatalog, modelUnit, parameterRows, outputs } = require("./hardware.cjs");
const root = path.resolve(__dirname, "../data/hardware");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));

test("legacy unknowns are null, never zero; source input is preserved", () => {
  const source = [{ id: "sample", manufacturer: "example", model: 123, tdp: 0, die: 0, cores: 8 }];
  const original = JSON.stringify(source);
  const [r] = normalizeCatalog(source, manifest, "cpus");
  assert.equal(r.model, "123");
  assert.equal(r.tdp, null);
  assert.equal(r.die, null);
  assert.equal(r.threads, null);
  assert.equal(r.cores, 8);
  assert.equal(r.status, "legacy-unverified");
  assert.equal(r.missing.die, "legacy-zero-unspecified");
  assert.equal(r.missing.threads, "not-provided");
  assert.equal(JSON.stringify(source), original);
});
test("duplicate ids, negative and non-finite specifications are rejected", () => {
  const row = { id: "sample", manufacturer: "example", model: "x", tdp: 100 };
  assert.throws(() => normalizeCatalog([row, row], manifest, "cpus"));
  for (const tdp of [-1, NaN, Infinity, "100"])
    assert.throws(() => normalizeCatalog([{ ...row, tdp }], manifest, "cpus"));
});
test("units distinguish silicon area, storage capacity and impact scale", () => {
  assert.equal(modelUnit("cpu.dieGwp"), "kg CO2e/mm2");
  assert.equal(modelUnit("memory.dieGwp"), "kg CO2e/cm2");
  assert.equal(modelUnit("memory.density.ddr4"), "GB/cm2");
  assert.throws(() => modelUnit("new.unspecified"));
  const out = JSON.parse(outputs()["parameters.json"]);
  const param = (id) => out.find((row) => row.id === id);
  assert.equal(param("terminals.laptop.storage").unit, "GB");
  assert.equal(param("servers.standard_1u.storage").unit, "TB");
  assert.equal(param("nvidia-dgx-h100-8.gpu_embodied").unit, "g CO2e/accelerator");
  assert.equal(param("cpu.baseGwp").unit, "kg CO2e/component");
});
test("illustrative zero is retained and is not a catalog missing-value sentinel", () => {
  const rows = JSON.parse(outputs()["parameters.json"]);
  const battery = rows.find((row) => row.id === "terminals.desktop.battery");
  assert.equal(battery.value, 0);
  assert.equal(battery.status, "fictional-configurations-not-product-inventories");
});
test("snapshots have matching checksums and outputs are deterministic and current", () => {
  const a = outputs();
  assert.deepEqual(a, outputs());
  for (const [file, data] of Object.entries(a))
    assert.equal(fs.readFileSync(path.join(root, file), "utf8"), data, file);
  const rows = JSON.parse(a["parameters.json"]);
  assert.equal(new Set(rows.map((r) => `${r.dataset}:${r.id}`)).size, rows.length);
  assert(rows.every((r) => Number.isFinite(r.value) && r.unit && r.status && r.sourceRevision.length === 40));
});
test("CSV preserves commas, quotes and multiline provenance and leaves unknowns empty", () => {
  assert.equal(
    csv([{ id: 'a,"b"', value: null, note: "line\nnext" }], ["id", "value", "note"]),
    'id,value,note\n"a,""b""",,"line\nnext"\n'
  );
});
test("new AI fields cannot be exported without an explicit unit", () => {
  const snapshot = manifest.snapshots.find((s) => s.id === "ai-hardware-profiles");
  assert.throws(() => parameterRows(snapshot, { profiles: [{ value: "x", invented: 12 }] }), /Unit missing/);
});

test("base products may have an empty model suffix and unknown fields are rejected", () => {
  const row = { id: "apple-m1", manufacturer: "apple", serie: "m1", model: "" };
  assert.equal(normalizeCatalog([row], manifest, "cpus")[0].model, "");
  assert.throws(() => normalizeCatalog([{ ...row, unknownPower: 5 }], manifest, "cpus"), /Unknown catalog field/);
});
