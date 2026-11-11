const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../data/cloud");
const inputs = require("./cloud-embodied-inputs.json");

// Original Teads Scope 3 Ratios sheet, in kg CO2e. No hourly allocation here.
const coefficients = Object.freeze({ base: 1000, memory: 22.1904 / 16, cpu: 100, ssd: 100, hdd: 50, gpu: 150 });

function calculateHost(host) {
  for (const key of ["memory", "sockets", "ssd", "hdd", "gpus", "gpuMemory"]) {
    if (!Number.isFinite(host[key]) || host[key] < 0) throw new Error(`Invalid host ${key}`);
  }
  for (const key of ["sockets", "ssd", "hdd", "gpus"]) {
    if (!Number.isInteger(host[key])) throw new Error(`Physical host ${key} must be an integer`);
  }
  if (host.sockets < 1 || host.memory < 16) throw new Error("Host must include a CPU and at least 16 GB RAM");
  if (host.gpus === 0 && host.gpuMemory !== 0) throw new Error("GPU memory without GPUs");
  // Local extension: the original GPU proxy includes 16 GB; extra VRAM uses the DRAM proxy.
  const gpu = coefficients.gpu + Math.max(0, host.gpuMemory - 16) * coefficients.memory;
  const kg = coefficients.base + (host.memory - 16) * coefficients.memory
    + (host.sockets - 1) * coefficients.cpu + host.ssd * coefficients.ssd
    + host.hdd * coefficients.hdd + host.gpus * gpu;
  if (!Number.isFinite(kg)) throw new Error("Non-finite host impact");
  return Number((kg / 1000).toFixed(7));
}

function profileValue(profile, records) {
  if (!profile.donor) return calculateHost(profile.host);
  const donor = records.find((record) => record.id === profile.donor);
  if (!donor || donor.embodied !== profile.value) throw new Error(`Historical donor changed: ${profile.donor}`);
  const delta = profile.memoryDelta ?? 0;
  if (!Number.isFinite(profile.value) || profile.value <= 0 || !Number.isFinite(delta) || delta < 0) throw new Error("Invalid historical proxy");
  const value = profile.value + delta * coefficients.memory / 1000;
  if (!Number.isFinite(value)) throw new Error("Non-finite historical proxy");
  return Number(value.toFixed(7));
}

function applyProfiles(catalogs, profiles = inputs.profiles) {
  const result = Object.fromEntries(Object.entries(catalogs).map(([provider, records]) => [provider, records.map((r) => ({ ...r }))]));
  const seen = new Set();
  for (const profile of profiles) {
    if (!profile.sources?.length || !profile.assumptions) throw new Error("Profile needs sources and assumptions");
    const records = result[profile.provider];
    if (!records || !profile.ids?.length) throw new Error("Profile needs an existing provider and explicit targets");
    const value = profileValue(profile, records);
    for (const id of profile.ids) {
      const key = `${profile.provider}/${id}`;
      if (seen.has(key)) throw new Error(`Duplicate target: ${key}`);
      seen.add(key);
      const record = records.find((r) => r.id === id);
      if (!record) throw new Error(`Missing target: ${key}`);
      if (record.embodied == null) record.embodied = value;
      else if (record.embodied !== value) throw new Error(`Refusing to overwrite existing embodied: ${key}`);
    }
  }
  return result;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length !== 1 || !["--write", "--check"].includes(args[0])) throw new Error("Use --write or --check");
  const catalogs = Object.fromEntries([...new Set(inputs.profiles.map((p) => p.provider))].map((p) => [p, JSON.parse(fs.readFileSync(path.join(root, `${p}-vms.json`), "utf8"))]));
  if (Object.values(catalogs).some((rows) => rows.some((r) => r.embodied_allocated != null))) throw new Error("Archived gap-fill method: use scripts/cloud-hosts.cjs for migrated catalogs");
  const next = applyProfiles(catalogs);
  let changed = false;
  for (const [provider, rows] of Object.entries(next)) {
    const count = rows.filter((r, i) => r.embodied !== catalogs[provider][i].embodied).length;
    console.log(`${provider}: ${count} missing embodied values filled`);
    if (!count) continue;
    changed = true;
    if (args[0] === "--write") fs.writeFileSync(path.join(root, `${provider}-vms.json`), JSON.stringify(rows, null, 2) + "\n");
  }
  if (changed && args[0] === "--check") process.exitCode = 1;
}

module.exports = { coefficients, calculateHost, profileValue, applyProfiles, inputs };
