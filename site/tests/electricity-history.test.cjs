const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
require("ts-node").register({ transpileOnly: true, compilerOptions: { module: "CommonJS" } });
const { restoreLegacyElectricity } = require("../../scripts/electricity-history.ts");
const { exportToCsv } = require("../../index.ts");
const { parseCsv } = require("../src/data.ts");

const ids = ["factor", "mix"].flatMap(collection =>
  ["yearly", "monthly"].flatMap(frequency => ["", "-green"].map(suffix => `${collection}/country-${frequency}${suffix}`))
);
const source = {
  version: "1.3.68", commit: "pinned", releaseDate: "2026-11-06", upstreamObservationDate: null,
  description: "Published outputs, not raw observations",
};

function fixtures(callback) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "d4b-electricity-history-"));
  const original = process.cwd();
  try {
    process.chdir(directory);
    fs.mkdirSync("data/factor", { recursive: true });
    fs.mkdirSync("data/mix", { recursive: true });
    const snapshot = { source, territories: { BM: "Bermuda", TL: "Timor-Leste" }, datasets: {} };
    for (const id of ids) {
      const monthly = id.includes("monthly");
      snapshot.datasets[id] = {
        BM: { [monthly ? "2026-12" : "2026"]: { gwp: 0, wu: null } },
        TL: { [monthly ? "2026-12" : "2026"]: { gwp: 0.9, wu: 0.1 } },
      };
      fs.writeFileSync(`data/${id}.json`, JSON.stringify({
        FR: { [monthly ? "2027-02" : "2027"]: { gwp: 0.04, wu: 0.02 } },
        BM: { [monthly ? "2027-02" : "2027"]: { gwp: 0.2, wu: 0.3 } },
      }));
      fs.writeFileSync(`data/${id}.csv`, "native CSV");
    }
    callback(snapshot);
  } finally {
    process.chdir(original);
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

test("historical references retain values, carry across years and expose their provenance", () => fixtures(snapshot => {
  const original = JSON.stringify(snapshot);
  const result = restoreLegacyElectricity(["FR"], snapshot, exportToCsv);
  assert.equal(JSON.stringify(snapshot), original, "the pinned snapshot is immutable");
  assert.deepEqual(Object.keys(result.territories), ["BM", "TL"]);
  assert.equal(result.sourceSnapshot.upstreamObservationDate, null);
  for (const id of ids) {
    const data = JSON.parse(fs.readFileSync(`data/${id}.json`, "utf8"));
    const monthly = id.includes("monthly");
    assert.deepEqual(data.FR[monthly ? "2027-02" : "2027"], { gwp: 0.04, wu: 0.02 });
    assert.deepEqual(data.BM[monthly ? "2026-12" : "2026"], { gwp: 0, wu: null });
    assert.deepEqual(data.BM[monthly ? "2027-02" : "2027"], { gwp: 0, wu: null });
    assert.equal(result.datasets[id].lastPublishedPeriod.BM, monthly ? "2026-12" : "2026");
    const [header, ...rows] = parseCsv(fs.readFileSync(`data/${id}.csv`, "utf8"));
    assert.equal(rows.length, Object.values(data).reduce((n, series) => n + Object.keys(series).length, 0));
    const bm = rows.find(row => row[0] === "BM");
    assert.equal(bm[header.indexOf("gwp")], "0");
    assert.equal(bm[header.indexOf("wu")], "");
  }
}));

test("current upstream data takes precedence when a historical territory returns", () => fixtures(snapshot => {
  const result = restoreLegacyElectricity(["FR", "BM"], snapshot, exportToCsv);
  assert.deepEqual(Object.keys(result.territories), ["TL"]);
  for (const id of ids) {
    const data = JSON.parse(fs.readFileSync(`data/${id}.json`, "utf8"));
    assert.deepEqual(data.BM[id.includes("monthly") ? "2027-02" : "2027"], { gwp: 0.2, wu: 0.3 });
    assert.equal(Object.keys(data.BM).length, 1, "historical values do not replace native data");
  }
}));

test("no fallback rewrites native datasets when every territory is available", () => fixtures(snapshot => {
  const before = Object.fromEntries(ids.map(id => [id, fs.readFileSync(`data/${id}.json`, "utf8")]));
  const result = restoreLegacyElectricity(["FR", "BM", "TL"], snapshot, exportToCsv);
  assert.deepEqual(result.territories, {});
  for (const id of ids) assert.equal(fs.readFileSync(`data/${id}.json`, "utf8"), before[id]);
}));

test("published historical territories preserve the pinned series in every output variant", () => {
  const snapshot = JSON.parse(fs.readFileSync("sources/ember-legacy-territories.json", "utf8"));
  const provenance = JSON.parse(fs.readFileSync("data/electricity-provenance.json", "utf8"));
  assert.equal(provenance.sourceSnapshot.commit, snapshot.source.commit);
  for (const [id, countries] of Object.entries(snapshot.datasets)) {
    const data = JSON.parse(fs.readFileSync(`data/${id}.json`, "utf8"));
    for (const code of Object.keys(provenance.territories))
      for (const [period, values] of Object.entries(countries[code]))
        assert.deepEqual(data[code][period], values, `${id} / ${code} / ${period}`);
  }
});
