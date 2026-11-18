import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { assessedFields, AssessedCollection, validateFieldAssessments, retainUnchangedAssessments } from "./field-assessments";
import { generateAi, generateClouds } from "../index";
import { generate, providers, HostInputs, VirtualMachine } from "./cloud-hosts";

const root = path.resolve(__dirname, "..");
const readJson = (file: string) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const datasets: [string, AssessedCollection][] = [
  ["ai/models", "models"],
  ["cloud/cpus", "cpus"],
  ["cloud/accelerators", "accelerators"],
  ...providers.flatMap((provider) =>
    (["regions", "vms", "hosts"] as const).map((kind): [string, AssessedCollection] => [
      `cloud/${provider}-${kind}`,
      kind,
    ])
  ),
];

test("field assessments are optional and validate every public AI/cloud dataset", () => {
  for (const [file, collection] of datasets) {
    for (const record of readJson(`data/${file}.json`))
      assert.doesNotThrow(() => validateFieldAssessments(record, collection, `${file}/${record.id ?? record.name}`));
  }
  const record = {
    name: "model",
    reasoning: false,
    fields: { reasoning: "supported", context: "tentative", corpus: "missing" },
  };
  const before = structuredClone(record);
  validateFieldAssessments(record, "models");
  assert.deepEqual(record, before, "validation must not mutate values or annotate other fields");
});

test("record notes and notes assessments are rejected even without other metadata", () => {
  for (const collection of Object.keys(assessedFields) as AssessedCollection[]) {
    for (const notes of ["Regional estimate, not a measurement", "", null, undefined]) {
      assert.throws(() => validateFieldAssessments({ notes }, collection), /public collection documentation/);
    }
    assert.throws(() => validateFieldAssessments({ fields: { notes: "missing" } }, collection), /unknown assessed field/);
    assert.doesNotThrow(() => validateFieldAssessments({}, collection));
  }
});

test("zero, false and empty lists are present; absent/null/empty-string retain their missing semantics", () => {
  for (const value of [0, false, [] as unknown[]]) {
    assert.doesNotThrow(() => validateFieldAssessments({ ref: value, fields: { ref: "supported" } }, "regions"));
    assert.throws(() => validateFieldAssessments({ ref: value, fields: { ref: "missing" } }, "regions"));
  }
  for (const record of [{}, { ref: null }, { ref: "" }]) {
    assert.doesNotThrow(() => validateFieldAssessments({ ...record, fields: { ref: "missing" } }, "regions"));
    assert.throws(() => validateFieldAssessments({ ...record, fields: { ref: "supported" } }, "regions"));
  }
  // Value types and collection-required fields are checked by the existing domain tests.
});

test("malformed states, unknown fields, nested paths and recursive metadata are rejected", () => {
  for (const fields of [
    null,
    [],
    "supported",
    {},
    { memory: true },
    { memory: "certain" },
    { memory: { state: "supported" } },
    { fields: "supported" },
    { memroy: "missing" },
    { "parameters.active": "supported" },
    { reasoning: "missing" },
  ]) {
    assert.throws(() => validateFieldAssessments({ memory: 16, fields }, "vms"));
  }
  assert.throws(() => validateFieldAssessments({ context: 128, fields: { context: "missing" } }, "models"));
  assert.doesNotThrow(() =>
    validateFieldAssessments({ reasoning: false, fields: { reasoning: "tentative" } }, "models")
  );
  assert.doesNotThrow(() => validateFieldAssessments({ fields: { reasoning: "tentative" } }, "models"));
});

test("field annotations do not change CSV bytes for models, regions, VMs, hosts or hardware", async () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "d4b-fields-"));
  const cwd = process.cwd();
  try {
    for (const dir of ["ai", "cloud"])
      fs.cpSync(path.join(root, "data", dir), path.join(temp, "data", dir), { recursive: true });
    process.chdir(temp);
    await generateAi();
    await generateClouds();
    const before = new Map(datasets.map(([file]) => [file, fs.readFileSync(`data/${file}.csv`)]));
    for (const [file] of datasets)
      assert.deepEqual(before.get(file), fs.readFileSync(path.join(root, `data/${file}.csv`)), `${file}: published projection`);
    for (const [file, collection] of datasets) {
      const records = JSON.parse(fs.readFileSync(`data/${file}.json`, "utf8"));
      const identity = collection === "models" ? "name" : "id";
      records[0].fields = { [identity]: "supported" };
      fs.writeFileSync(`data/${file}.json`, JSON.stringify(records));
    }
    await generateAi();
    await generateClouds();
    for (const [file] of datasets) {
      assert.deepEqual(fs.readFileSync(`data/${file}.csv`), before.get(file), file);
      assert.ok(!fs.readFileSync(`data/${file}.csv`, "utf8").split(/\r?\n/)[0].split(",").includes("fields"));
      assert.ok(JSON.parse(fs.readFileSync(`data/${file}.json`, "utf8"))[0].fields);
    }
    for (const [file, collection] of datasets) {
      const jsonPath = `data/${file}.json`;
      const saved = fs.readFileSync(jsonPath);
      const records = JSON.parse(saved.toString());
      records[0].fields = { invalid: "supported" };
      fs.writeFileSync(jsonPath, JSON.stringify(records));
      await assert.rejects(collection === "models" ? generateAi() : generateClouds(), /unknown assessed field/);
      fs.writeFileSync(jsonPath, saved);
    }
  } finally {
    process.chdir(cwd);
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test("host recalculation preserves unchanged assessments and clears those for changed outputs", () => {
  const inputs: HostInputs = readJson("sources/cloud/host-inputs.json");
  const catalogs = Object.fromEntries(providers.map((p) => [p, readJson(`data/cloud/${p}-vms.json`)])) as Record<
    (typeof providers)[number],
    VirtualMachine[]
  >;
  const host = inputs.profiles[0];
  host.fields = { id: "supported", embodied: "supported" };
  host.embodied += 1;
  const vm = catalogs[host.provider as (typeof providers)[number]].find((r) => r.host === host.id)!;
  vm.fields = { id: "supported", embodied_allocated: "supported" };
  vm.embodied_allocated! += 1;
  const before = structuredClone({ inputs, catalogs });
  const result = generate(catalogs, inputs);
  assert.deepEqual(result.hosts[host.provider as (typeof providers)[number]].find((r) => r.id === host.id)!.fields, {
    id: "supported",
  });
  assert.deepEqual(result.vms[host.provider as (typeof providers)[number]].find((r) => r.id === vm.id)!.fields, {
    id: "supported",
  });
  assert.deepEqual({ inputs, catalogs }, before, "generation must not mutate its inputs");
  vm.memory = -1;
  vm.fields = { memory: "tentative" };
  assert.throws(() => generate(catalogs, inputs), "metadata cannot bypass host constraints");
});

test("unassessed calculations stay unassessed, including after the last annotation is invalidated", () => {
  assert.deepEqual(retainUnchangedAssessments({ context: 10 }, { context: 20 }), { context: 20 });
  assert.deepEqual(retainUnchangedAssessments({ context: 10, fields: { context: "supported" } }, { context: 20 }), {
    context: 20,
  });
  assert.deepEqual(
    retainUnchangedAssessments(
      { parameters: { active: 7, total: 7 }, fields: { parameters: "supported" } },
      { parameters: { total: 7, active: 7 } }
    ),
    { parameters: { total: 7, active: 7 }, fields: { parameters: "supported" } }
  );
});
