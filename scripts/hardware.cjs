const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const ROOT = path.resolve(__dirname, "..");
const HARDWARE = path.join(ROOT, "data/hardware");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;

function csv(rows, columns) {
  const cell = (value) => {
    if (value === null || value === undefined) return "";
    const text = typeof value === "object" ? JSON.stringify(value) : String(value);
    return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  return [columns.join(","), ...rows.map((row) => columns.map((key) => cell(row[key])).join(","))].join("\n") + "\n";
}

function normalizeCatalog(rows, manifest, kind) {
  const ids = new Set();
  return rows.map((row) => {
    assert.equal(typeof row.id, "string");
    assert.equal(typeof row.manufacturer, "string", `Manufacturer missing for ${row.id}`);
    assert(["string", "number"].includes(typeof row.model), `Model missing for ${row.id}`);
    const identityFields = ["id", "manufacturer", "serie", "model", "architecture", "platform", "type"];
    for (const key of Object.keys(row))
      assert(
        identityFields.includes(key) || key in manifest.catalogUnits,
        `Unknown catalog field ${key}; define its unit before export`
      );
    assert(row.id && !ids.has(row.id), `Duplicate or empty ${kind} id: ${row.id}`);
    ids.add(row.id);
    const item = {
      ...row,
      model: String(row.model),
      status: manifest.catalogs[kind].status,
      source: manifest.catalogs[kind].source,
      missing: {},
    };
    for (const field of Object.keys(manifest.catalogUnits)) {
      if ((kind === "cpus" && field === "memory") || (kind === "accelerators" && ["threads", "smp"].includes(field)))
        continue;
      const value = row[field];
      if (value == null || value === 0) {
        item[field] = null;
        item.missing[field] = value === 0 ? "legacy-zero-unspecified" : "not-provided";
      } else {
        assert(typeof value === "number" && Number.isFinite(value) && value > 0, `Invalid ${kind}/${row.id}/${field}`);
      }
    }
    return item;
  });
}

// Explicit units: unknown paths fail instead of silently inheriting a generic unit.
function modelUnit(p) {
  if (/^cpu\.(dieGwp|baseGwp)$/.test(p)) return p.endsWith("dieGwp") ? "kg CO2e/mm2" : "kg CO2e/component";
  if (/^cpu\.(dieAdpe|baseAdpe)$/.test(p)) return p.endsWith("dieAdpe") ? "kg Sb eq/mm2" : "kg Sb eq/component";
  if (/^(nodeFactors|processorPackaging|memory\.packaging)\./.test(p)) return "dimensionless";
  if (/^(memory|storage)\.dieGwp$/.test(p)) return "kg CO2e/cm2";
  if (/^(memory|storage)\.baseGwp$/.test(p) || p === "storage.hddGwp") return "kg CO2e/component";
  if (p === "memory.powerPerGb") return "W/GB";
  if (/^memory\.density\./.test(p) || p === "storage.density") return "GB/cm2";
  if (/^storage\.powerPerTb\./.test(p)) return "W/TB";
  if (/^display\.gwpPerCm2\./.test(p)) return "kg CO2e/cm2";
  if (/^display\.baseGwp\./.test(p)) return "kg CO2e/display";
  if (/^display\.powerPerCm2\./.test(p)) return "W/cm2";
  if (/^battery\.gwpPerKwh\./.test(p)) return "kg CO2e/kWh capacity";
  if (/^battery\.(cobalt|lithium)GramsPerKwh\./.test(p)) return "g/kWh capacity";
  if (/^structuralGwp\./.test(p)) return "kg CO2e/equipment";
  if (p === "powerAssumptions.terminalCpuLoad") return "dimensionless";
  if (/^powerAssumptions\..*W$/.test(p)) return "W";
  if (p === "assemblyAssumptions.serverMemoryModuleGb") return "GB/module";
  if (/^assemblyAssumptions\.server(Ssd|Hdd)DriveTb$/.test(p)) return "TB/drive";
  throw new Error(`Unit missing for component parameter ${p}`);
}
const CONFIG_UNITS = {
  cpuCount: "count",
  gpuCount: "count",
  cpuDie: "mm2",
  gpuDie: "mm2",
  cpuNode: "nm",
  gpuNode: "nm",
  cpuTdp: "W",
  gpuTdp: "W",
  ram: "GB",
  screenDiag: "inch",
  battery: "Wh",
  lifetime: "year",
  usageHours: "h/day",
  pue: "dimensionless",
};
const AI_UNITS = {
  cpu_count: "count",
  cpu_power: "W",
  cpu_embodied: "g CO2e/CPU",
  gpu_count: "count",
  gpu_flops: "FLOP/s",
  gpu_power: "W",
  gpu_embodied: "g CO2e/accelerator",
  ram: "byte",
  ram_power: "W/byte",
  ram_embodied: "g CO2e/byte",
  ssd: "byte",
  ssd_power: "W/byte",
  ssd_embodied: "g CO2e/byte",
  enclosure_units: "rack unit",
  enclosure_power: "W",
  enclosure_embodied: "g CO2e/enclosure",
  mfu: "dimensionless",
};
function parameterRows(snapshot, data) {
  const rows = [];
  function add(id, raw, unit, status = snapshot.status) {
    const value = Number(raw);
    assert(raw !== "" && Number.isFinite(value) && value >= 0, `Invalid parameter ${id}`);
    assert(unit, `Unit missing for ${id}`);
    rows.push({ id, value, unit, status, source: snapshot.source, sourceRevision: snapshot.revision });
  }
  if (snapshot.id === "hardware-models") {
    function walk(obj, prefix = "") {
      for (const [key, value] of Object.entries(obj)) {
        const p = prefix ? `${prefix}.${key}` : key;
        if (typeof value === "number") {
          const historical =
            /^(cpu\.|memory\.(dieGwp|baseGwp|powerPerGb)$|storage\.(dieGwp|baseGwp|density|hddGwp)$|storage\.powerPerTb\.)/.test(
              p
            );
          add(p, value, modelUnit(p), historical ? "historical-proxy-not-revalidated" : "illustrative-not-calibrated");
        } else if (value && typeof value === "object") walk(value, p);
      }
    }
    walk(data);
  } else if (snapshot.id === "hardware-configurations") {
    for (const group of ["terminals", "servers"]) {
      for (const [id, config] of Object.entries(data[group])) {
        for (const [field, value] of Object.entries(config)) {
          if (field === "storage") add(`${group}.${id}.${field}`, value, group === "terminals" ? "GB" : "TB");
          else if (CONFIG_UNITS[field]) add(`${group}.${id}.${field}`, value, CONFIG_UNITS[field]);
          else
            assert(
              ["ramType", "storageType", "screenTech", "batteryChem"].includes(field),
              `Unmapped configuration field ${field}`
            );
        }
      }
    }
  } else if (snapshot.id === "ai-hardware-profiles") {
    const ids = new Set();
    for (const profile of data.profiles) {
      assert(profile.value && !ids.has(profile.value), "Duplicate AI profile");
      ids.add(profile.value);
      for (const [field, value] of Object.entries(profile)) {
        if (["label", "value"].includes(field)) continue;
        add(`${profile.value}.${field}`, value, AI_UNITS[field]);
      }
    }
  } else throw new Error(`Unknown snapshot ${snapshot.id}`);
  return rows;
}

function outputs() {
  const manifest = read(path.join(HARDWARE, "manifest.json"));
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.status, "experimental");
  const out = {};
  const inputs = {};
  for (const kind of ["cpus", "accelerators"]) {
    assert.equal(manifest.catalogs[kind].status, "legacy-unverified");
    const sourcePath = path.resolve(HARDWARE, manifest.catalogs[kind].source);
    inputs[manifest.catalogs[kind].source] = crypto
      .createHash("sha256")
      .update(fs.readFileSync(sourcePath))
      .digest("hex");
    const rows = normalizeCatalog(read(sourcePath), manifest, kind);
    out[`${kind}.json`] = json(rows);
    const columns = [...new Set(rows.flatMap(Object.keys))];
    out[`${kind}.csv`] = csv(rows, columns);
  }
  const parameters = [];
  for (const snapshot of manifest.snapshots) {
    assert(snapshot.source.startsWith(`https://github.com/digital4better/methodology/blob/${snapshot.revision}/`));
    const buffer = fs.readFileSync(path.join(HARDWARE, snapshot.file));
    assert.equal(
      crypto.createHash("sha256").update(buffer).digest("hex"),
      snapshot.sha256,
      `Source snapshot changed: ${snapshot.id}`
    );
    const data = JSON.parse(buffer);
    assert.equal(data.status, snapshot.status);
    const rows = parameterRows(snapshot, data);
    out[`${snapshot.id}.csv`] = csv(rows, ["id", "value", "unit", "status", "source", "sourceRevision"]);
    parameters.push(...rows.map((row) => ({ dataset: snapshot.id, ...row })));
  }
  out["parameters.json"] = json(parameters);
  out["provenance.json"] = json({
    schemaVersion: 1,
    inputs,
    snapshots: manifest.snapshots.map(({ id, source, revision, sha256 }) => ({ id, source, revision, sha256 })),
  });
  return out;
}
function run(check) {
  const out = outputs();
  for (const [file, content] of Object.entries(out)) {
    const target = path.join(HARDWARE, file);
    if (check) assert.equal(fs.readFileSync(target, "utf8"), content, `${file} is stale; run yarn build:hardware`);
    else fs.writeFileSync(target, content);
  }
  console.log(`Hardware: ${Object.keys(out).length} generated files ${check ? "verified" : "written"}.`);
}
if (require.main === module) run(process.argv.includes("--check"));
module.exports = { csv, normalizeCatalog, modelUnit, parameterRows, outputs, run };
