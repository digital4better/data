const { test } = require("node:test");
const assert = require("node:assert/strict");
require("ts-node").register({ transpileOnly: true, compilerOptions: { module: "CommonJS" } });
const { fetchWorldMix, processData } = require("../../index.ts");
const { PassThrough } = require("node:stream");

// Column names and source casing from Ember's July 2026 wide CSV exports.
const yearly = `Area,ISO 3 code,Year,Area type,Electricity source,Is aggregated source,Generation (TWh),Share of generation (%),Ember region
France,FRA,2025,Country or economy,Solar,False,20,20,Europe
France,FRA,2025,Country or economy,Other fossil,False,5,5,Europe
France,FRA,2025,Country or economy,Other renewables,False,0,0,Europe
France,FRA,2025,Country or economy,Total generation,True,100,100,Europe
France,FRA,2025,Country or economy,Net imports,False,-12,-12,Europe
France,FRA,2025,Country or economy,Clean,True,95,95,Europe
France,FRA,2025,Country or economy,"Hydro, bioenergy and other renewables",True,75,75,Europe
France,FRA,2025,Country or economy,Demand,True,88,88,Europe
Lesotho,LSO,2025,Country or economy,Solar,False,0,,Africa
Unknown,XXX,2010,Country or economy,Solar,False,1,10,Europe
World,,2025,Region,Total generation,True,1000,100,
Europe,,2025,Region,Gas,False,150,30,
EU,,2025,Region,Solar,False,50,20,
`;
const monthly = `Area,ISO 3 code,Date,Area type,Electricity source,Is aggregated source,Generation (TWh),Share of generation (%),Ember region
France,FRA,2025-01-01,Country or economy,Solar,False,0,0,Europe
France,FRA,2025-01-01,Country or economy,Total generation,True,10,100,Europe
France,FRA,2025-01-01,Country or economy,Net imports,False,2,20,Europe
World,,2025-01-01,Region,Total generation,True,100,100,
`;

test("Ember wide exports preserve fuel shares, totals, signed imports and existing geography keys", async (t) => {
  const urls = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    urls.push(url);
    return new Response(url.includes("yearly") ? yearly : monthly);
  });
  const result = {};
  await fetchWorldMix(result);
  assert.deepEqual(urls, [
    "https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv",
    "https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_monthly_global.csv",
  ]);
  assert.equal(result.FR["2025"].mix.Solar, 0.2);
  assert.equal(result.FR["2025"].mix["Other Fossil"], 0.05);
  assert.equal(result.FR["2025"].mix["Other Renewables"], 0);
  assert.equal(result.FR["2025"].generatedTWh, 100);
  assert.equal(result.FR["2025"].importedTWh, -12);
  assert.equal(result.FR["2025-01"].mix.Solar, 0);
  assert.equal(result.FR["2025-01"].generatedTWh, 10);
  assert.equal(result.FR["2025-01"].importedTWh, 2);
  assert.equal(result.World["2025"].generatedTWh, 1000);
  assert.equal(result.Europe["2025"].mix.Gas, 0.3);
  assert.equal(result.FR["2025"].mix.Clean, undefined);
  assert.equal(result.FR["2025"].mix.Demand, undefined);
  assert.equal(result.LS, undefined, "an unavailable share alone must not create a zero-valued record");
  assert.equal(result.EU, undefined, "overlapping regional groups are not extra continents");
});

test("Ember HTTP failures are reported before parsing", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("unavailable", { status: 503 }));
  await assert.rejects(fetchWorldMix({}), /Request failed with status code 503/);
});

test("Ember migration notices, empty files and changed schemas fail with an actionable error", async (t) => {
  for (const csv of [
    'notice,new_url\n"This file is no longer updated",https://example.com/new.csv\n',
    "\n\n",
    yearly.replace("Share of generation (%)", "Different metric"),
  ]) {
    const mock = t.mock.method(globalThis, "fetch", async () => new Response(csv));
    await assert.rejects(fetchWorldMix({}), /Unexpected CSV schema/);
    mock.mock.restore();
  }
});

test("Ember rejects malformed periods, non-numeric metrics and empty useful coverage", async (t) => {
  for (const [annual, month, expected] of [
    [yearly.replaceAll(",2025,", ",not-a-year,"), monthly, /Invalid Ember year/],
    [yearly, monthly.replaceAll("2025-01-01", "not-a-date"), /Invalid Ember date/],
    [yearly.replace(",20,20,Europe", ",20,NaN,Europe"), monthly, /Invalid Ember value/],
    [yearly.replace("Solar,False", "New fuel,False"), monthly, /Unsupported Ember electricity source/],
    [yearly.replace("Solar,False", ",False"), monthly, /Invalid Ember electricity source/],
    [yearly.split("\n")[0]+"\n", monthly, /No usable Ember data/],
  ]) {
    const mock = t.mock.method(globalThis, "fetch", async (url) => new Response(url.includes("yearly") ? annual : month));
    await assert.rejects(fetchWorldMix({}), expected);
    mock.mock.restore();
  }
});

test("buffered CSV input is fully processed under Node 24", async () => {
  const input = new PassThrough();
  const expected = 5000;
  input.end("Year,Value\n" + "2025,1\n".repeat(expected));
  let rows = 0;
  await processData(input, (row) => {
    assert.equal(row.year, 2025);
    assert.equal(row.value, 1);
    rows++;
  });
  assert.equal(rows, expected);
});
