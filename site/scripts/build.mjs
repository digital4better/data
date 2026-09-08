import { build } from "vite";
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, copyFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { collections, guides, tr, datasetTitle, repository, license } from "../src/content.mjs";
const base = "/data/";
const origin = "https://digital4better.github.io";
const out = resolve("site/dist");
const datasets = [];
for (const c of collections)
  for (const file of readdirSync(`data/${c.id}`)
    .filter((f) => f.endsWith(".json"))
    .sort()) {
    const path = `data/${c.id}/${file}`;
    const data = JSON.parse(readFileSync(path, "utf8"));
    const temporal = ["factor", "mix"].includes(c.id);
    const world = file.startsWith("world-");
    let rows = Array.isArray(data) ? data : Object.values(data);
    let periods = [];
    if (temporal) {
      periods = world ? Object.keys(data) : [...new Set(Object.values(data).flatMap((v) => Object.keys(v)))];
      rows = world ? Object.values(data) : Object.values(data).flatMap((v) => Object.values(v));
    }
    let modified = null;
    try {
      modified =
        execFileSync("git", ["log", "-1", "--format=%cI", "--", path], { encoding: "utf8" }).trim().slice(0, 10) ||
        null;
    } catch {}
    datasets.push({
      id: file.slice(0, -5),
      file,
      collection: c.id,
      csv: readdirSync(`data/${c.id}`).includes(file.replace(".json", ".csv")),
      count: rows.length,
      fields: [...new Set(rows.flatMap((r) => Object.keys(r)))],
      start: periods.sort()[0],
      end: periods.at(-1),
      modified,
      size: statSync(path).size,
    });
  }
await build();
await build({ build: { ssr: "src/server.tsx", outDir: ".ssr", emptyOutDir: true } });
const { render } = await import(resolve("site/.ssr/server.mjs"));
const template = readFileSync(`${out}/index.html`, "utf8");
const routes = [
  "",
  "methodology",
  "reuse",
  ...collections.flatMap((c) => [c.id, ...datasets.filter((d) => d.collection === c.id).map((d) => `${c.id}/${d.id}`)]),
  ...guides.map((g) => `guides/${g.id}`),
];
const escape = (s) =>
  String(s).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const json = (s) => JSON.stringify(s).replaceAll("<", "\\u003c");
const url = (lang, route) => `${origin}${base}${lang}/${route ? route + "/" : ""}`;
function datasetSchema(d, lang) {
  const c = collections.find((c) => c.id === d.collection);
  return {
    "@type": "Dataset",
    "@id": url(lang, `${c.id}/${d.id}`) + "#dataset",
    name: `${tr(c.title, lang)} — ${datasetTitle(d.file, lang)}`,
    description: `${datasetTitle(d.file, lang)}. ${tr(c.description, lang)} ${tr(c.limits, lang)}`,
    url: url(lang, `${c.id}/${d.id}`),
    license,
    creator: { "@type": "Organization", name: "Digital4Better", url: "https://digital4better.com" },
    isAccessibleForFree: true,
    inLanguage: lang,
    ...(d.start ? { temporalCoverage: `${d.start}/${d.end}` } : {}),
    distribution: ["json", ...(d.csv ? ["csv"] : [])].map((ext) => ({
      "@type": "DataDownload",
      encodingFormat: ext === "json" ? "application/json" : "text/csv",
      contentUrl: `${origin}${base}${c.id}/${d.id}.${ext}`,
    })),
  };
}
for (const lang of ["fr", "en"])
  for (const route of routes) {
    const [id, sub] = route.split("/");
    const c = collections.find((c) => c.id === id);
    const d = datasets.find((d) => d.collection === id && d.id === sub);
    const g = id === "guides" ? guides.find((g) => g.id === sub) : null;
    const title = d
      ? `${datasetTitle(d.file, lang)} — ${tr(c.title, lang)}`
      : c
      ? tr(c.title, lang)
      : g
      ? tr(g.title, lang)
      : route === "methodology"
      ? lang === "fr"
        ? "Méthodologie et sources"
        : "Methodology and sources"
      : route === "reuse"
      ? lang === "fr"
        ? "Réutiliser les données"
        : "Reuse the data"
      : lang === "fr"
      ? "Données ouvertes sur l’empreinte du numérique"
      : "Open data for digital sustainability";
    const description = d
      ? `${datasetTitle(d.file, lang)} — ${tr(c.description, lang)}${d.start ? ` ${d.start}–${d.end}.` : ""}`
      : c
      ? tr(c.description, lang)
      : g
      ? tr(g.sections[0][1], lang)
      : route === "methodology"
      ? (lang === "fr" ? "Sources, unités, hypothèses, estimations et limites des six collections Open Data de Digital4Better." : "Sources, units, assumptions, estimates and limitations of Digital4Better’s six Open Data collections.")
      : route === "reuse"
      ? (lang === "fr" ? "Téléchargez les données CSV et JSON, conservez leur schéma source et réutilisez-les avec attribution sous licence ODbL." : "Download CSV and JSON data, preserve source schemas and reuse the datasets with attribution under the ODbL license.")
      : lang === "fr"
      ? "Six collections ouvertes : électricité, cloud, IA et équipements. Explorez, comprenez et téléchargez les données en CSV et JSON."
      : "Six open collections: electricity, cloud, AI and equipment. Explore, understand and download data in CSV and JSON.";
    const schema = d
      ? datasetSchema(d, lang)
      : {
          "@type": c ? "DataCatalog" : g ? "Article" : !route ? "DataCatalog" : "WebPage",
          name: title,
          description,
          url: url(lang, route),
          inLanguage: lang,
          ...(c || !route
            ? {
                dataset: datasets
                  .filter((d) => !c || d.collection === c.id)
                  .map((d) => datasetSchema(d, lang)),
              }
            : {}),
        };
    const head = `<link rel="describedby" href="${origin}${base}llms.txt" type="text/plain"/><link rel="alternate" href="${origin}${base}catalog.json" type="application/json" title="Dataset catalog"/><title>${escape(title)} | Digital4Better Open Data</title><meta name="description" content="${escape(
      description
    )}"/><link rel="canonical" href="${url(lang, route)}"/>${["fr", "en"]
      .map((l) => `<link rel="alternate" hreflang="${l}" href="${url(l, route)}"/>`)
      .join("")}<link rel="alternate" hreflang="x-default" href="${url(
      "en",
      route
    )}"/><meta property="og:title" content="${escape(title)}"/><meta property="og:description" content="${escape(
      description
    )}"/><meta property="og:url" content="${url(lang, route)}"/><meta property="og:type" content="${
      g ? "article" : "website"
    }"/><meta property="og:locale" content="${
      lang === "fr" ? "fr_FR" : "en_US"
    }"/><meta property="og:image" content="${origin}${base}social-card.png"/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/><meta property="og:image:alt" content="Digital4Better Open Data — Digital sustainability"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:image" content="${origin}${base}social-card.png"/><script type="application/ld+json">${json({
      "@context": "https://schema.org",
      ...schema,
    })}</script>`;
    const props = { lang, route, catalog: { datasets }, base };
    const html = template
      .replace('<html lang="en">', `<html lang="${lang}">`)
      .replace("<!--page-head-->", head)
      .replace("<!--app-html-->", () => render(props))
      .replace("<!--page-data-->", () => `<script id="page-data" type="application/json">${json(props)}</script>`);
    const dir = `${out}/${lang}/${route}`;
    mkdirSync(dir, { recursive: true });
    writeFileSync(`${dir}/index.html`, html);
  }
// GitHub Pages serves static files: an immediate refresh also works without JavaScript.
writeFileSync(`${out}/index.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Digital4Better Open Data</title><link rel="canonical" href="${url("en", "")}"><script>try { var saved = localStorage.getItem('d4b-data-language'); } catch (_) {} var language = saved === 'fr' || saved === 'en' ? saved : ((navigator.languages && navigator.languages[0]) || navigator.language || 'en').toLowerCase().split('-')[0] === 'fr' ? 'fr' : 'en'; location.replace('${base}' + language + '/' + location.search + location.hash);</script><noscript><meta http-equiv="refresh" content="0; url=${base}en/"></noscript></head><body><p><a href="${base}en/">Continue to the English catalog</a> · <a href="${base}fr/" lang="fr">Catalogue français</a></p></body></html>`);
writeFileSync(
  `${out}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${["fr", "en"]
    .flatMap((lang) => routes.map((route) => `<url><loc>${url(lang, route)}</loc></url>`))
    .join("")}</urlset>`
);
writeFileSync(
  `${out}/404.html`,
  '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Page not found · Digital4Better</title><h1>Page not found / Page introuvable</h1><p><a href="/data/fr/">Catalogue français</a> · <a href="/data/en/">English catalog</a></p></html>'
);
copyFileSync("site/social-card.png", `${out}/social-card.png`);
copyFileSync("site/favicon.ico", `${out}/favicon.ico`);
writeFileSync(
  `${out}/catalog.json`,
  JSON.stringify({
    license,
    collections: collections.map((c) => ({ id: c.id, title: c.title, description: c.description, sources: c.sources })),
    datasets: datasets.map((d) => ({ ...d, pages: { fr: url("fr", `${d.collection}/${d.id}`), en: url("en", `${d.collection}/${d.id}`) }, distribution: datasetSchema(d, "en").distribution })),
  }, null, 2)
);
console.log(`Generated ${routes.length * 2} bilingual pages; ${datasets.length} datasets. No geography pages.`);

writeFileSync(`${out}/llms.txt`, `# Digital4Better Open Data

> Six bilingual collections of reusable data on digital sustainability. Static descriptions and original JSON/CSV downloads require no JavaScript or account.

License: ODbL 1.0 (${license}). Preserve original schemas and cite sources. Missing values are not zero. File modification dates are not source refresh dates. Green variants are scenarios described on collection pages. AI specifications and estimates do not establish an environmental footprint.

## Catalog

- [Machine-readable catalog](${origin}${base}catalog.json): All datasets, absolute download URLs, bilingual pages, fields and coverage.
- [Sitemap](${origin}${base}sitemap.xml): Canonical editorial and dataset pages.
${collections.flatMap((c) => ["fr", "en"].map((lang) => `- [${tr(c.title, lang)} (${lang})](${url(lang, c.id)}): ${tr(c.description, lang)}`)).join("\n")}

## Methodology and reuse

${["fr", "en"].flatMap((lang) => ["methodology", "reuse"].map((route) => `- [${route} (${lang})](${url(lang, route)})`)).join("\n")}

## Guides

${guides.flatMap((g) => ["fr", "en"].map((lang) => `- [${tr(g.title, lang)} (${lang})](${url(lang, `guides/${g.id}`)})`)).join("\n")}
`);
