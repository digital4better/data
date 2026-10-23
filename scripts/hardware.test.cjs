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
  const out = allParameters(outputs());
  const param = (id) => out.find((row) => row.id === id);
  assert.equal(param("terminals.laptop.storage").unit, "GB");
  assert.equal(param("servers.standard_1u.storage").unit, "TB");
  assert.equal(param("nvidia-dgx-h100-8.gpu_embodied").unit, "g CO2e/accelerator");
  assert.equal(param("cpu.baseGwp").unit, "kg CO2e/component");
});
test("illustrative zero is retained and is not a catalog missing-value sentinel", () => {
  const rows = allParameters(outputs());
  const battery = rows.find((row) => row.id === "terminals.desktop.battery");
  assert.equal(battery.value, 0);
  assert.equal(battery.status, "fictional-configurations-not-product-inventories");
});
test("snapshots have matching checksums and outputs are deterministic and current", () => {
  const a = outputs();
  assert.deepEqual(a, outputs());
  for (const [file, data] of Object.entries(a))
    assert.equal(fs.readFileSync(path.join(root, file), "utf8"), data, file);
  const rows = allParameters(a);
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

function allParameters(out) {
  const rows = [];
  for (const [file, content] of Object.entries(out)) {
    if (!file.endsWith(".json") || file === "provenance.json") continue;
    const records = JSON.parse(content);
    for (const record of records) {
      if (file.endsWith("-factors.json")) rows.push(record);
      else if (record.dataset)
        for (const property of Object.values(record.properties || {})) {
          if (typeof property === "object" && property.sourcePath)
            rows.push({
              id: property.sourcePath,
              value: property.value,
              unit: property.unit,
              dataset: record.dataset,
              status: record.status,
              source: record.source,
              sourceRevision: record.sourceRevision,
            });
        }
    }
  }
  return rows;
}
test("family migration preserves every numeric parameter exactly once", () => {
  const expected = manifest.snapshots.flatMap((snapshot) =>
    parameterRows(snapshot, JSON.parse(fs.readFileSync(path.resolve(root, snapshot.file), "utf8"))).map((row) => ({
      dataset: snapshot.id,
      ...row,
    }))
  );
  const project = (rows) =>
    rows
      .map(({ dataset, id, value, unit, status, source, sourceRevision }) => ({
        dataset,
        id,
        value,
        unit,
        status,
        source,
        sourceRevision,
      }))
      .sort((a, b) => `${a.dataset}:${a.id}`.localeCompare(`${b.dataset}:${b.id}`));
  assert.deepEqual(project(allParameters(outputs())), project(expected));
});
test("all family, model, technology and factor references resolve", () => {
  const out = outputs();
  const documents = Object.fromEntries(
    Object.entries(out)
      .filter(([f]) => f.endsWith(".json"))
      .map(([f, c]) => [f, JSON.parse(c)])
  );
  documents["manifest.json"] = manifest;
  function checkRef(ref) {
    const [file, id] = ref.split("#");
    assert(documents[file], `Missing file ${file}`);
    if (id)
      assert(
        Array.isArray(documents[file])
          ? documents[file].some((r) => r.id === id)
          : id.split(".").reduce((v, k) => v?.[k], documents[file]),
        `Missing reference ${ref}`
      );
  }
  function walk(value, key = "") {
    if (
      typeof value === "string" &&
      (key.endsWith("Ref") ||
        key.endsWith("Refs") ||
        key === "appliesTo" ||
        key === "technologyFile" ||
        key === "factorFiles")
    )
      checkRef(value);
    else if (Array.isArray(value)) value.forEach((v) => walk(v, key));
    else if (value && typeof value === "object")
      Object.entries(value).forEach(([k, v]) => walk(v, key.endsWith("Refs") ? key : k));
  }
  Object.values(documents).forEach((doc) => walk(doc));
  for (const family of Object.values(manifest.families)) {
    assert(out[family.references]);
    assert(out[family.factors]);
  }
});
test("silicon factors are shared by reference without mixing areas or technology scope", () => {
  const out = outputs();
  const silicon = JSON.parse(out["semiconductors-factors.json"]);
  assert.equal(silicon.find((r) => r.id === "cpu.dieGwp").unit, "kg CO2e/mm2");
  assert.equal(silicon.find((r) => r.id === "memory.dieGwp").unit, "kg CO2e/cm2");
  assert(!JSON.parse(out["cpus-factors.json"]).some((r) => r.id === "cpu.dieGwp"));
  assert(JSON.parse(out["memories.json"])[0].factorRefs.includes("semiconductors-factors.json#memory.dieGwp"));
  assert(JSON.parse(out["semiconductors.json"]).every((r) => r.properties.application === "processor-die-model-only"));
});
test("configurations retain categorical fields and do not claim product identities", () => {
  const out = outputs();
  const laptop = JSON.parse(out["laptops.json"])[0];
  assert.equal(laptop.kind, "configuration");
  assert.equal(laptop.properties.ramType, "ddr5");
  assert.equal(laptop.properties.storage.unit, "GB");
  const servers = JSON.parse(out["servers.json"]);
  assert.equal(servers.find((r) => r.id === "standard_1u").properties.storage.unit, "TB");
  const ai = servers.find((r) => r.id === "nvidia-dgx-h100-8");
  assert.equal(ai.kind, "scenario");
  assert.equal(ai.properties.gpu_count.value, 8);
  assert.equal(ai.factorRefs.gpu_embodied, "accelerators-factors.json#nvidia-dgx-h100-8.gpu_embodied");
  assert.equal(ai.properties.gpu_embodied, undefined);
});
