const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
require("ts-node").register({ transpileOnly: true, compilerOptions: { module: "CommonJS" } });
const { rowsOf, subsetOf, parseCsv, csvSubset } = require("../src/data.ts");
test("nested and world filtered JSON preserve keys, null and zero", () => {
  const data = { FR: { 2025: { gwp: 0 }, 2026: { gwp: null } }, DE: { 2025: { gwp: 0.2 } } };
  const rows = rowsOf(data, true, false).filter((r) => r.key === "FR");
  assert.deepEqual(subsetOf(data, rows, true, false), { FR: data.FR });
  const world = { 2025: { gwp: 0 }, 2026: { gwp: null } };
  assert.deepEqual(subsetOf(world, rowsOf(world, true, true).slice(1), true, true), { 2026: { gwp: null } });
});
test("CSV parsing preserves quotes, commas, embedded newlines and empty values", () => {
  assert.deepEqual(parseCsv('id,note,empty\r\na,"b,""c""\nd",\r\n'), [
    ["id", "note", "empty"],
    ["a", 'b,"c"\nd', ""],
  ]);
});
test("CSV selection uses identifiers, not source row order", () => {
  const source = [
    { id: "b", value: 2 },
    { id: "a", value: 0 },
  ];
  const csv = "id,value\na,0\nb,2\n";
  assert.deepEqual(parseCsv(csvSubset(csv, source, rowsOf(source, false, false).slice(0, 1), false, false)), [
    ["id", "value"],
    ["b", "2"],
  ]);
});
test("all temporal CSV files agree with JSON including green variants", () => {
  for (const folder of ["factor", "mix"])
    for (const file of fs.readdirSync(`data/${folder}`).filter((f) => f.endsWith(".json"))) {
      const source = JSON.parse(fs.readFileSync(`data/${folder}/${file}`, "utf8"));
      const world = file.startsWith("world-");
      const rows = rowsOf(source, true, world);
      const [header, ...csv] = parseCsv(fs.readFileSync(`data/${folder}/${file.replace(".json", ".csv")}`, "utf8"));
      assert.equal(csv.length, rows.length, file);
      const pi = header.findIndex((h) => h === "year" || h === "period");
      const gi = header.findIndex((h) => ["country", "continent", "subdivision"].includes(h));
      const keyed = new Map(rows.map((r) => [`${r.key}/${r.period}`, r.values]));
      for (const cells of csv) {
        const values = keyed.get(`${world ? "world" : cells[gi]}/${cells[pi]}`);
        assert.ok(values, file);
        for (const [k, v] of Object.entries(values)) {
          const actual = cells[header.indexOf(k)];
          assert.notEqual(actual, undefined, `${file} ${k}`);
          if (v !== null)
            assert.ok(
              Math.abs(Number(actual) - v) <= Math.max(1e-14, Math.abs(v) * 1e-8),
              `${file} ${k}: ${actual} != ${v}`
            );
        }
      }
    }
});
test("filtered temporal CSV has same selection as JSON", () => {
  const source = { FR: { 2025: { gwp: 0 }, 2026: { gwp: 1 } }, DE: { 2026: { gwp: 2 } } };
  const selected = rowsOf(source, true, false).filter((r) => r.key === "FR" && r.period === "2026");
  assert.deepEqual(
    parseCsv(csvSubset("country,year,gwp\nDE,2026,2\nFR,2025,0\nFR,2026,1\n", source, selected, true, false)),
    [
      ["country", "year", "gwp"],
      ["FR", "2026", "1"],
    ]
  );
});

const { projectLocation, groupedLocations, numericBars, countsBy } = require("../src/chart-data.ts");
test("cloud projection validates coordinates and keeps zero coordinates", () => {
  assert.deepEqual(projectLocation(0, 0), [400, 200]);
  assert.deepEqual(projectLocation(-180, 90), [0, 0]);
  assert.deepEqual(projectLocation(180, -90), [800, 400]);
  for (const coords of [
    [null, 0],
    [0, undefined],
    [181, 0],
    [0, -91],
    [NaN, 0],
  ])
    assert.equal(projectLocation(...coords), null);
  const paris = projectLocation(2.35, 48.86);
  assert.ok(paris[0] > 400 && paris[1] < 200);
});
test("co-located cloud regions remain inspectable as a group", () => {
  const rows = rowsOf(
    [
      { id: "a", lat: 0, lon: 0 },
      { id: "b", lat: 0, lon: 0 },
      { id: "missing", lat: null, lon: null },
    ],
    false,
    false
  );
  const points = groupedLocations(rows);
  assert.equal(points.length, 1);
  assert.deepEqual(
    points[0].rows.map((r) => r.values.id),
    ["a", "b"]
  );
});
test("charts preserve zero, exclude missing values and retain distinct units", () => {
  const rows = rowsOf(
    {
      a: { value: 0, unit: "W" },
      b: { value: null, unit: "W" },
      c: { value: 20, unit: "kWh" },
      d: { value: Infinity },
    },
    false,
    false
  );
  assert.deepEqual(
    numericBars(rows, "value").map((r) => [r.value, r.unit]),
    [
      [20, "kWh"],
      [0, "W"],
    ]
  );
  const models = rowsOf(
    [{ vendor: "a", input: ["text", "text", "image"] }, { vendor: "a", input: ["text"] }, { vendor: "b" }],
    false,
    false
  );
  assert.deepEqual(countsBy(models, "vendor"), [
    { name: "a", value: 2 },
    { name: "b", value: 1 },
  ]);
  assert.deepEqual(countsBy(models, "input"), [
    { name: "text", value: 2 },
    { name: "image", value: 1 },
  ]);
});

const { selectedTerritory, rowsAtPeriod, allowedFilters, resolvePeriod } = require("../src/chart-data.ts");
test("territory detail is explicit; only the world dataset selects itself", () => {
  assert.equal(selectedTerritory("", false), undefined);
  assert.equal(selectedTerritory("FR", false), "FR");
  assert.equal(selectedTerritory("", true), "world");
});
test("map data never carry a territory forward from another period", () => {
  const rows = rowsOf({ FR: { 2025: { Solar: 0.2 } }, DE: { 2026: { Solar: 0 } } }, true, false);
  assert.deepEqual(
    rowsAtPeriod(rows, "2026").map((r) => [r.key, r.values.Solar]),
    [["DE", 0]]
  );
  assert.deepEqual(rowsAtPeriod(rows, "2024"), []);
});
test("switching schemas drops inapplicable filters", () => {
  assert.deepEqual(allowedFilters("cloud", "aws-regions"), ["country"]);
  assert.deepEqual(allowedFilters("cloud", "aws-vms"), []);
  assert.deepEqual(allowedFilters("equipment", "energy"), []);
  assert.ok(allowedFilters("ai", "models").includes("tools"));
});
test("annual/monthly switch retains the requested year when available", () => {
  assert.equal(resolvePeriod("2025", ["2026-03", "2025-12", "2025-11"]), "2025-12");
  assert.equal(resolvePeriod("2025-11", ["2026", "2025"]), "2025");
  assert.equal(resolvePeriod("2025-11", ["2025-12", "2025-11"]), "2025-11");
});

test("country maps combine subdivision outlines into one selectable territory", () => {
  const { displayPaths } = require("../src/chart-data.ts");
  const paths = { "US-CA": "M0 0L1 1Z", "US-NY": "M2 2L3 3Z", FR: "M4 4L5 5Z" };
  const combined = displayPaths(paths, true);
  assert.deepEqual(Object.keys(combined), ["US", "FR"]);
  assert.ok(combined.US.includes(paths["US-CA"]) && combined.US.includes(paths["US-NY"]));
  assert.deepEqual(displayPaths(paths, false), paths);
});

const { termLabel, regionLabel } = require('../src/localization.ts');
test('source energy and equipment keys have localized presentation without changing identifiers', () => {
  for (const file of ['data/energy/energy-impacts.json', 'data/equipment/energy.json']) {
    const source = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const key of Object.keys(source)) {
      assert.ok(termLabel(key, 'fr'));
      assert.ok(termLabel(key, 'en'));
      if (!['smartphone'].includes(key)) assert.notEqual(termLabel(key, 'fr'), key);
    }
  }
  assert.equal(termLabel('Other Renewables', 'fr'), 'Autres énergies renouvelables');
  assert.equal(termLabel('claude-opus-4', 'fr'), 'claude-opus-4');
  assert.equal(regionLabel('DE', 'Germany', 'fr'), 'Allemagne');
  assert.equal(termLabel('text', 'fr'), 'Texte');
});

const { tooltipPosition } = require('../src/tooltip-position.ts');
test('tooltip follows its anchor and flips at viewport edges using its actual size', () => {
  assert.deepEqual(tooltipPosition(100, 100, 280, 200, 1200, 800), {left:116, top:116});
  assert.deepEqual(tooltipPosition(1100, 700, 280, 350, 1200, 800), {left:804, top:334});
  assert.deepEqual(tooltipPosition(200, 400, 374, 360, 390, 844), {left:8, top:416});
  assert.deepEqual(tooltipPosition(5, 5, 280, 200, 300, 220), {left:8, top:8});
});

const { impactColor, impactColors } = require('../src/chart-data.ts');
test('impact scale uses the original green-to-black palette with bounded endpoints', () => {
  assert.equal(impactColor(0, 10), '#2AA364');
  assert.equal(impactColor(10, 10), '#000000');
  assert.equal(impactColor(20, 10), '#000000');
  assert.equal(impactColor(0, 0), '#2AA364');
  assert.equal(impactColor(null, 10), '#e5e7eb');
  assert.equal(impactColor(NaN, 10), '#e5e7eb');
  assert.ok(impactColors.includes(impactColor(5, 10)));
});
