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

test("cloud hardware references resolve, with distinct CPU and GPU variants", () => {
  const cpus = json("cpus.json"), accelerators = json("accelerators.json");
  const cpuIds = new Set(cpus.map((r) => r.id)), acceleratorIds = new Set(accelerators.map((r) => r.id));
  assert.equal(cpuIds.size, cpus.length);
  assert.equal(acceleratorIds.size, accelerators.length);
  for (const p of providers) for (const vm of json(`${p}-vms.json`)) {
    for (const id of Array.isArray(vm.cpu) ? vm.cpu : vm.cpu ? [vm.cpu] : []) assert.ok(cpuIds.has(id), `${p}/${vm.id}/${id}`);
    if (vm.accelerator) assert.ok(acceleratorIds.has(vm.accelerator), `${p}/${vm.id}/${vm.accelerator}`);
  }
  assert.equal(lookup("cpus", "google-axion").platform, "neoverse v2");
  assert.equal(lookup("cpus", "google-axion-n3").platform, "neoverse n3");
  assert.ok(!("tdp" in lookup("cpus", "intel-xeon-6973pc")));
  assert.ok(!("cores" in lookup("cpus", "amd-epyc-9004")));
  assert.equal(lookup("accelerators", "nvidia-blackwell-b200-192").memory, 192);
  assert.equal(lookup("accelerators", "nvidia-blackwell-b200").memory, 180);
  assert.equal(lookup("ovhcloud-vms", "t2-180").accelerator, "nvidia-tesla-v100s32");
  assert.equal(lookup("gcp-vms", "c4-standard-24").cpu[0], "intel-xeon-8581c");
  assert.equal(lookup("gcp-vms", "c4-standard-24-lssd").cpu[0], "intel-xeon-6985pc");
});

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

test("sourced hardware specifications do not regress", () => {
  const cases = [
    // https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html
    // 4 B200 GPUs; 3 x 7500 GB local NVMe. The size suffix is not a GPU count.
    ["aws", "p6e-gb200-36xlarge", { accelerators: 4, ssd: 22500 }],
    // https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/memory-optimized/m-series
    ["azure", "m16ms", { memory: 437.5 }],
    ["azure", "m8ms", { memory: 218.75 }],
    // https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/memory-optimized/mdsv3-hm-series
    ["azure", "m416ds6-v3", { memory: 5696 }],
    ["azure", "m832ds12-v3", { memory: 11400 }],
    ["azure", "m832ids16-v3", { memory: 15200 }],
    // https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/memory-optimized/msv3-hm-series
    ["azure", "m416s6-v3", { memory: 5696 }],
    // https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/gpu-accelerated/ncast4v3-series
    ["azure", "nc4as-t4-v3", { ssd: 176, cpu: ["amd-epyc-7v12"] }],
    ["azure", "nc8as-t4-v3", { ssd: 352, cpu: ["amd-epyc-7v12"] }],
    ["azure", "nc16as-t4-v3", { ssd: 352, cpu: ["amd-epyc-7v12"] }],
    ["azure", "nc64as-t4-v3", { memory: 440, ssd: 2816, cpu: ["amd-epyc-7v12"] }],
    // https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/gpu-accelerated/ndma100v4-series
    ["azure", "nd96amsr-a100-v4", { memory: 1900, ssd: 6400 }],
    // https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/gpu-accelerated/ndmi300xv5-series
    // Storage left unchanged: inconsistent GB/GiB/TiB labels across the official page require separate review.
    ["azure", "nd96isr-mi300x-v5", { memory: 1850 }],
    // https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/fpga-accelerated/np-series
    ["azure", "np10s", { memory: 168, ssd: 736 }],
    ["azure", "np20s", { memory: 336, ssd: 1474 }],
    ["azure", "np40s", { memory: 672, ssd: 2948 }],
    // https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/gpu-accelerated/nv-series
    // Counts use physical dual-GPU 16 GB M60 boards; fractional VM allocations are retained.
    ["azure", "nv6", { accelerators: 0.5 }],
    ["azure", "nv12", { accelerators: 1 }],
    ["azure", "nv24", { accelerators: 2 }],
    // https://docs.cloud.google.com/compute/docs/cpu-platforms?hl=en
    ["gcp", "x4-1440-24t-metal", { cpu: ["intel-xeon-8490h"] }],
    ["gcp", "x4-1920-32t-metal", { cpu: ["intel-xeon-8490h"] }],
    ["gcp", "x4-480-6t-metal", { cpu: ["intel-xeon-8490h"] }],
    ["gcp", "x4-480-8t-metal", { cpu: ["intel-xeon-8490h"] }],
    ["gcp", "x4-960-12t-metal", { cpu: ["intel-xeon-8490h"] }],
    ["gcp", "x4-960-16t-metal", { cpu: ["intel-xeon-8490h"] }],
  ];
  for (const [provider, id, expected] of cases) {
    const record = lookup(`${provider}-vms`, id);
    assert.ok(record, `${provider}/${id}`);
    for (const [field, value] of Object.entries(expected))
      assert.deepEqual(record[field], value, `${provider}/${id}/${field}`);
  }
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
