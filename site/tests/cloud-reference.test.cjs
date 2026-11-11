const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
require("ts-node").register({ transpileOnly: true, compilerOptions: { module: "CommonJS" } });
const { parseCsv } = require("../src/data.ts");

const root = path.resolve(__dirname, "../../data/cloud");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const json = (name) => JSON.parse(read(name));
const providers = ["aws", "azure", "gcp", "oracle", "ovhcloud", "scaleway"];
const lookup = (dataset, id) => json(`${dataset}.json`).find((m) => m.id === id);

test("cloud catalogs have unique identifiers and finite nonnegative capacities", () => {
  for (const provider of providers) for (const kind of ["vms", "regions"]) {
    const dataset = `${provider}-${kind}`;
    const records = json(`${dataset}.json`);
    assert.equal(new Set(records.map((m) => m.id)).size, records.length, dataset);
    for (const m of records) {
      for (const field of ["vcpus", "ocpus", "memory", "ssd", "hdd", "accelerators", "embodied", "pue", "wue", "ref"]) {
        if (!(field in m)) continue;
        let value = m[field];
        // Historical Scaleway entries retain their decimal-comma RAM strings.
        if (provider === "scaleway" && field === "memory" && typeof value === "string") {
          assert.match(value, /^\d+,\d+$/);
          value = Number(value.replace(",", "."));
        }
        assert.ok(Number.isFinite(value) && value >= 0, `${dataset}/${m.id}/${field}`);
      }
    }
  }
});

test("approved cloud RAM corrections match the documented specifications", () => {
  assert.equal(lookup("aws-vms", "d2-8xlarge").memory, 244);
  assert.equal(lookup("ovhcloud-vms", "a10-45").memory, 42);
  assert.equal(lookup("ovhcloud-vms", "a10-90").memory, 85);
  assert.equal(lookup("ovhcloud-vms", "a10-180").memory, 170);
});

test("reviewed hardware corrections retain their official sources and corrected values", () => {
  const { corrections } = require("../../scripts/cloud-hardware-corrections.json");
  const seen = new Set();
  const cpus = new Set(json("cpus.json").map((r) => r.id));
  for (const correction of corrections) {
    const key = `${correction.provider}/${correction.id}`;
    assert.ok(!seen.has(key), key);
    seen.add(key);
    assert.ok(correction.sources.length > 0, key);
    for (const source of correction.sources) {
      assert.ok(["docs.aws.amazon.com", "learn.microsoft.com", "docs.cloud.google.com"].includes(new URL(source).hostname), key);
    }
    const record = lookup(`${correction.provider}-vms`, correction.id);
    assert.ok(record, key);
    assert.deepEqual(Object.keys(correction.before), Object.keys(correction.after), key);
    assert.ok(!("embodied" in correction.after), key);
    for (const [field, value] of Object.entries(correction.after)) {
      assert.deepEqual(record[field], value, `${key}/${field}`);
      assert.notDeepEqual(correction.before[field], value, `${key}/${field}`);
    }
    for (const cpu of record.cpu || []) assert.ok(cpus.has(cpu), `${key}/${cpu}`);
  }
  assert.equal(lookup("aws-vms", "p6e-gb200-36xlarge").accelerators, 4);
  assert.equal(lookup("azure-vms", "nv6").accelerators, 0.5);
});

test("cloud exports preserve empty cells, fractional GPUs and every JSON row", () => {
  for (const provider of providers) for (const kind of ["regions", "vms"]) {
    const dataset = `${provider}-${kind}`;
    const records = json(`${dataset}.json`);
    const [headers, ...rows] = parseCsv(read(`${dataset}.csv`));
    assert.equal(rows.length, records.length, dataset);
    for (let i = 0; i < records.length; i++) {
      assert.deepEqual(rows[i], headers.map((key) => records[i][key] == null ? "" : String(records[i][key])), `${dataset}/${records[i].id}`);
    }
  }
  assert.equal(lookup("gcp-vms", "g4-standard-6").accelerators, 0.125);
  assert.ok(!("ssd" in lookup("gcp-vms", "g4-standard-12")));
});

test("cloud refresh keeps distinct physical configurations and missing regional metrics", () => {
  assert.equal(lookup("aws-vms", "m9g-metal-48xl").virtual, false);
  assert.equal(lookup("azure-vms", "d16ds-v7").ssd, 880);
  assert.equal(lookup("oracle-vms", "bm-standard-a4-ax-48").vcpus, 96);
  assert.equal(lookup("ovhcloud-vms", "h200-1920").ssd, 31120);
  assert.equal(lookup("scaleway-vms", "b300-sxm-8-288g").accelerators, 8);
  assert.equal(lookup("gcp-regions", "europe-north2").ref, 1);
  assert.equal(lookup("gcp-regions", "northamerica-south1").ref, 0.25);
  assert.ok(!("ref" in lookup("gcp-regions", "asia-southeast3")));
  for (const n of [1, 2, 3]) assert.ok(!("pue" in lookup("scaleway-regions", `it-mil-${n}`)));
});

test("shared hardware CSVs retain missing silicon properties and all JSON rows", () => {
  for (const dataset of ["cpus", "accelerators"]) {
    const records = json(`${dataset}.json`);
    const [headers, ...rows] = parseCsv(read(`${dataset}.csv`));
    assert.equal(rows.length, records.length, dataset);
    for (let i = 0; i < records.length; i++) {
      assert.deepEqual(rows[i], headers.map((key) => records[i][key] == null ? "" : String(records[i][key])), `${dataset}/${records[i].id}`);
    }
  }
});

test("cloud reference notes are published without a refresh dataset", () => {
  const dist = path.resolve(root, "../../site/dist");
  const catalog = JSON.parse(fs.readFileSync(path.join(dist, "catalog.json"), "utf8"));
  assert.ok(!JSON.stringify(catalog).includes('"id":"refresh-2026-11-10"'));
  assert.equal(fs.readFileSync(path.join(dist, "cloud/README.md"), "utf8"), read("README.md"));
  assert.ok(!fs.existsSync(path.join(dist, "cloud/audits/refresh-2026-11-10.json")));
  assert.ok(!fs.existsSync(path.join(dist, "cloud/refresh-2026-11-10.json")));
});
