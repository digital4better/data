const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

test("fully labelled bars are noninteractive and retain their values and expand control", async () => {
  const { createServer } = await import("vite");
  const server = await createServer({
    server: { middlewareMode: true, watch: null },
  });
  try {
    const { Bars } = await server.ssrLoadModule("/src/charts.tsx");
    const props = {
      title: "Climate change",
      lang: "en",
      unit: "kg CO2e / kWh",
      items: [
        { name: "Coal", value: 1.02 },
        { name: "Gas", value: 0.434 },
      ],
    };
    const html = renderToStaticMarkup(React.createElement(Bars, props));
    assert.match(html, /Climate change/);
    assert.match(html, /Coal/);
    assert.match(html, /1\.02 kg CO2e \/ kWh/);
    assert.match(html, /Gas/);
    assert.match(html, /0\.434 kg CO2e \/ kWh/);
    assert.doesNotMatch(html, /role="button"|tabindex|aria-describedby|chart-tooltip|<button/);

    const limited = renderToStaticMarkup(React.createElement(Bars, { ...props, initialLimit: 1 }));
    assert.match(limited, /Coal/);
    assert.doesNotMatch(limited, /Gas/);
    assert.match(limited, /<button>Show all 2 values<\/button>/);
  } finally {
    await server.close();
  }
});

test("mix map disables unavailable territories and history is visible with annual and percent axes", async () => {
  const { createServer } = await import("vite");
  const server = await createServer({ server: { middlewareMode: true, watch: null } });
  try {
    const { MixMap, MixHistory } = await server.ssrLoadModule("/src/charts.tsx");
    const map = renderToStaticMarkup(React.createElement(MixMap, {
      paths: { Europe: "M0 0L1 1Z", missing: "M2 2L3 3Z" },
      rows: [{ key: "Europe", period: "2026", values: { Solar: 1 } }],
      period: "2026", names: { Europe: "Europe" }, lang: "fr", onSelect() {}, green: false, subdivisionLevel: false,
    }));
    assert.equal((map.match(/aria-pressed=/g) || []).length, 1);
    assert.match(map, /pointer-events="none"/);
    const rows = Array.from({ length: 8 }, (_, i) => ({ key: "world", period: String(2019 + i), values: { Hydro: 0.25, Solar: 0.75 } }));
    const history = renderToStaticMarkup(React.createElement(MixHistory, { rows, lang: "fr", name: "Monde" }));
    assert.ok(!history.includes("<details"));
    for (const row of rows) assert.ok(history.includes(`>${row.period}</text>`));
    for (const percent of [0, 25, 50, 75, 100]) assert.ok(history.includes(`>${percent} %</text>`));
    assert.ok(history.includes("Monde"));
  } finally { await server.close(); }
});
