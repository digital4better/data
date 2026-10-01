const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
require("ts-node").register({ transpileOnly: true, compilerOptions: { module: "CommonJS" } });
const { computeDistance, roundNumber, exportToCsv, exportFactorsAndMixes } = require("../../index.ts");
const { parseCsv } = require("../src/data.ts");
const regions = require("../../data/country/regions.json");
const impacts = require("../../data/energy/energy-impacts.json");
const root = path.resolve(__dirname, "../..");

function withTempDirectory(callback) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "d4b-generation-test-"));
  const cwd = process.cwd();
  try {
    process.chdir(directory);
    return callback(directory);
  } finally {
    process.chdir(cwd);
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

test("significant-digit rounding preserves zero and small impact factors", () => {
  assert.equal(roundNumber(0), 0);
  assert.equal(roundNumber(-0), 0);
  assert.equal(roundNumber(0.000000123456789), 0.000000123457);
  assert.equal(roundNumber(-123456.789), -123457);
});

test("geographic distances stay finite for identical and antipodal coordinates", () => {
  for (const origin of regions) {
    assert.equal(computeDistance(origin, origin), 0, origin.name);
    const opposite = { lat: -origin.lat, lon: origin.lon + 180 };
    assert.ok(Math.abs(computeDistance(origin, opposite) - Math.PI * 6371) < 0.001, origin.name);
    for (const destination of regions) {
      const distance = computeDistance(origin, destination);
      assert.ok(Number.isFinite(distance) && distance >= 0, `${origin.name}/${destination.name}`);
      assert.equal(distance, computeDistance(destination, origin));
    }
  }
  assert.equal(computeDistance({ lat: 0, lon: 0 }, { lat: 0, lon: 90 }), 10007.543);
});

test("CSV export rejects non-finite numbers before overwriting a file", () => withTempDirectory(() => {
  fs.writeFileSync("test.csv", "unchanged");
  for (const value of [NaN, Infinity, -Infinity]) {
    assert.throws(() => exportToCsv("test.csv", [{ value: 0 }, { value }]), /test.csv: non-finite value at row 3/);
    assert.equal(fs.readFileSync("test.csv", "utf8"), "unchanged");
  }
  exportToCsv("test.csv", [{ zero: 0, missing: null, optional: undefined, enabled: false, text: 'a,"b"\nc' }]);
  assert.deepEqual(parseCsv(fs.readFileSync("test.csv", "utf8")), [
    ["zero", "missing", "optional", "enabled", "text"],
    ["0", "", "", "false", 'a,"b"\nc'],
  ]);
}));

test("green exports distinguish unavailable renewable scenarios from valid zero shares", () => withTempDirectory(() => {
  for (const folder of ["mix", "factor"]) fs.mkdirSync(`data/${folder}`, { recursive: true });
  const emptyMix = Object.fromEntries(Object.keys(impacts).map((energy) => [energy, 0]));
  const aggregates = {};
  const now = new Date();
  for (const region of ["FR", "US-CA"]) {
    aggregates[region] = {};
    for (let year = 2019; year <= now.getUTCFullYear(); year++) {
      const lastMonth = year === now.getUTCFullYear() ? now.getUTCMonth() - 1 : 11;
      for (let month = 0; month <= lastMonth; month++) {
        const period = `${year}-${String(month + 1).padStart(2, "0")}`;
        const mix = { ...emptyMix, ...(year === 2019 ? { Gas: 1 } : { Hydro: 0.75, Solar: 0.25 }) };
        aggregates[region][period] = { mix, generatedTWh: 1, importedTWh: 0 };
      }
    }
  }
  exportFactorsAndMixes(aggregates);
  for (const scope of ["world", "continent", "country", "subdivision"]) {
    for (const cadence of ["yearly", "monthly"]) {
      const period = cadence === "yearly" ? "2019" : "2019-01";
      const availablePeriod = cadence === "yearly" ? "2020" : "2020-01";
      for (const folder of ["mix", "factor"]) {
        const name = `${scope}-${cadence}-green`;
        const data = JSON.parse(fs.readFileSync(`data/${folder}/${name}.json`, "utf8"));
        const series = scope === "world" ? data : Object.values(data)[0];
        assert.ok(Object.values(series[period]).every((value) => value === null), name);
        assert.ok(Object.values(series[availablePeriod]).every(Number.isFinite), name);
        if (folder === "mix") {
          assert.equal(series[availablePeriod].Bioenergy, 0);
          assert.equal(series[availablePeriod].Hydro, 0.75);
          assert.equal(series[availablePeriod].Solar, 0.25);
        } else {
          assert.equal(series[availablePeriod].gwp, roundNumber(impacts.Hydro.gwp * 0.75 + impacts.Solar.gwp * 0.25));
        }
        const [header, ...rows] = parseCsv(fs.readFileSync(`data/${folder}/${name}.csv`, "utf8"));
        const pi = header.indexOf(cadence === "yearly" ? "year" : "period");
        const missing = rows.filter((row) => row[pi] === period);
        assert.ok(missing.length);
        assert.ok(missing.every((row) => row.slice(pi + 1).every((value) => value === "")), name);
      }
    }
  }
}));

test("published CSV files contain no non-finite numeric cells", () => {
  function check(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) check(file);
      else if (file.endsWith(".csv")) {
        for (const [index, cells] of parseCsv(fs.readFileSync(file, "utf8")).entries()) {
          assert.ok(!cells.some((cell) => /^(NaN|[+-]?Infinity|undefined)$/.test(cell)), `${file}:${index + 1}`);
        }
      }
    }
  }
  check(path.join(root, "data"));
});

test("published distance CSV and JSON agree and self-distances are zero", () => {
  for (const name of ["country-to-country-distances", "region-to-region-distances"]) {
    const values = JSON.parse(fs.readFileSync(path.join(root, `data/country/${name}.json`), "utf8"));
    const [, ...rows] = parseCsv(fs.readFileSync(path.join(root, `data/country/${name}.csv`), "utf8"));
    assert.equal(rows.length, Object.keys(values).length, name);
    for (const [origin, destination, value] of rows) {
      const distance = values[origin + destination];
      assert.ok(Number.isFinite(distance) && distance >= 0, `${name}: ${origin}/${destination}`);
      assert.equal(String(distance), value);
      if (origin === destination) assert.equal(distance, 0);
    }
  }
});
