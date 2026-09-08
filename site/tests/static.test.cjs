const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = "site/dist";
const catalog = JSON.parse(fs.readFileSync(`${root}/catalog.json`, "utf8"));
const origin = "https://digital4better.github.io";
test("six collections and no geography or distance pages", () => {
  assert.deepEqual(
    catalog.collections.map((c) => c.id),
    ["factor", "mix", "cloud", "ai", "equipment", "energy"]
  );
  const sitemap = fs.readFileSync(`${root}/sitemap.xml`, "utf8");
  assert.ok(!/country\/|distance|geography/.test(sitemap));
  assert.equal(
    (sitemap.match(/<loc>/g) || []).length,
    2 * (3 + catalog.collections.length + catalog.datasets.length + 3)
  );
});
test("all pages contain static content, SEO and valid local download/navigation links", () => {
  const sitemap = fs.readFileSync(`${root}/sitemap.xml`, "utf8");
  for (const [, url] of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)) {
    const relative = url.replace(origin + "/data/", "");
    const html = fs.readFileSync(`${root}/${relative}index.html`, "utf8");
    assert.equal((html.match(/<h1>/g) || []).length, 1, url);
    assert.ok(html.includes(`<link rel="canonical" href="${url}"`), url);
    assert.ok(html.includes('hreflang="fr"') && html.includes('hreflang="en"'), url);
    assert.ok(html.includes(`lang="${relative.slice(0, 2)}"`), url);
    assert.ok(/name="description" content="[^"]+"/.test(html));
    const json = html.match(/type="application\/ld\+json">(.*?)<\/script>/s)[1];
    const schema = JSON.parse(json);
    assert.ok(schema.name && schema.description);
    for (const [, link] of html.matchAll(/(?:href|src)="(\/data\/[^"?#]*)(?:[^" ]*)"/g)) {
      const dest = link.replace("/data/", "");
      assert.ok(fs.existsSync(path.join(root, dest)), `${url}: ${link}`);
    }
    if (schema["@type"] === "Dataset") {
      assert.ok(html.includes("Dictionnaire") || html.includes("Field dictionary"));
      assert.ok(schema.distribution.length);
      for (const download of schema.distribution) assert.ok(html.includes(download.contentUrl.replace(origin, "")));
    }
  }
});
test("all dataset files remain byte-for-byte copies of the source", () => {
  for (const d of catalog.datasets)
    for (const ext of ["json", ...(d.csv ? ["csv"] : [])])
      assert.deepEqual(
        fs.readFileSync(`${root}/${d.collection}/${d.id}.${ext}`),
        fs.readFileSync(`data/${d.collection}/${d.id}.${ext}`)
      );
  for (const f of fs.readdirSync("data/country"))
    if (/\.(json|csv)$/.test(f))
      assert.deepEqual(fs.readFileSync(`${root}/country/${f}`), fs.readFileSync(`data/country/${f}`));
});

test("collection pages expose the explorer before the download catalog", () => {
  for (const lang of ["fr", "en"])
    for (const collection of catalog.collections) {
      const html = fs.readFileSync(`${root}/${lang}/${collection.id}/index.html`, "utf8");
      assert.ok(html.includes('class="card explorer"'), collection.id);
      assert.ok(html.indexOf('class="card explorer"') < html.indexOf('id="datasets"'), collection.id);
    }
});

test("project root redirects without JavaScript and missing pages are not indexed", () => {
  const html = fs.readFileSync(`${root}/index.html`, "utf8");
  assert.ok(html.includes('http-equiv="refresh" content="0; url=/data/en/"'));
  assert.ok(html.includes(`rel="canonical" href="${origin}/data/en/"`));
  assert.ok(html.includes('href="/data/fr/"'));
  assert.ok(html.includes('<noscript><meta http-equiv="refresh"'));
  assert.ok(html.includes('location.replace'));
  assert.ok(fs.readFileSync(`${root}/404.html`, "utf8").includes('name="robots" content="noindex"'));
});

test("unique descriptions and complete machine discovery across all pages", () => {
  const descriptions = new Set();
  const sitemap = fs.readFileSync(`${root}/sitemap.xml`, "utf8");
  for (const [, url] of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)) {
    const html = fs.readFileSync(`${root}/${url.replace(origin + '/data/', '')}index.html`, "utf8");
    const description = html.match(/name="description" content="([^"]+)"/)[1];
    assert.ok(!descriptions.has(description), `Duplicate description: ${url}`);
    descriptions.add(description);
    assert.ok(html.includes('rel="describedby"'));
    const schema = JSON.parse(html.match(/type="application\/ld\+json">(.*?)<\/script>/s)[1]);
    for (const d of schema.dataset || (schema['@type'] === 'Dataset' ? [schema] : [])) {
      assert.ok(d.description && d.name && d.license && d.url);
      assert.ok(d.distribution.every((x) => x['@type'] === 'DataDownload' && x.contentUrl.startsWith(origin + '/data/') && x.encodingFormat));
    }
  }
  const llms = fs.readFileSync(`${root}/llms.txt`, "utf8");
  assert.ok(llms.includes('ODbL') && llms.includes('/data/catalog.json'));
  for (const [, url] of llms.matchAll(/\]\((https:\/\/digital4better.github.io\/data\/[^)]+)\)/g)) {
    assert.ok(fs.existsSync(path.join(root, url.replace(origin + '/data/', ''))), url);
  }
  for (const d of catalog.datasets) {
    assert.ok(d.pages.fr && d.pages.en && d.distribution.length);
  }
});

test("root language routing respects saved choice, browser preference and storage failures", () => {
  const vm = require('node:vm');
  const html = fs.readFileSync(`${root}/index.html`, 'utf8');
  const script = html.match(/<script>(.*?)<\/script>/s)[1];
  for (const [saved, languages, expected, blocked] of [
    [null, ['fr-FR', 'en'], 'fr'], [null, ['en-US', 'fr'], 'en'],
    ['en', ['fr'], 'en'], ['fr', ['en'], 'fr'],
    ['invalid', ['fr-CA'], 'fr'], [null, ['de'], 'en'], [null, ['fr'], 'fr', true],
  ]) {
    let destination;
    vm.runInNewContext(script, {
      localStorage: { getItem: () => { if (blocked) throw new Error('denied'); return saved; } },
      navigator: { languages },
      location: { search: '?q=test', hash: '#main', replace: (value) => { destination = value; } },
    });
    assert.equal(destination, `/data/${expected}/?q=test#main`);
  }
});
