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
