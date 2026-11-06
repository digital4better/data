# Open Data catalog

The website is a static bilingual catalog built with React and Vite, deployed below `/data/` on GitHub Pages. Only `factor`, `mix`, `cloud`, `ai`, `equipment` and `energy` have published pages. Files under `data/country/` remain available as data assets, never as catalog pages.

## Local validation

Use the repository's Yarn installation:

```sh
yarn build:site
yarn check:site
yarn test:site
yarn preview:site --port 4173
```

Open http://127.0.0.1:4173/data/fr/ or http://127.0.0.1:4173/data/en/. `yarn start` builds the site then starts the preview. Rebuild after source changes. `build:site` reads existing data only; it does not fetch upstream sources or regenerate the data repository. The existing `yarn build` pipeline still generates data first, then the website.

## Content and routes

`src/content.mjs` is the six-collection editorial manifest, bilingual guides and field dictionary. `scripts/build.mjs` derives dataset inventory, fields, periods and committed modification dates from the current files and generates collection pages, individual dataset pages, metadata, `catalog.json` and `sitemap.xml`. React renders the HTML at build time and hydrates only the interactive controls. Data files load on their individual explorer pages.

URLs use stable source collection/file identifiers. Filters, period, metric, territory and sort are stored in query parameters and survive language changes. Canonical and hreflang links target clean URLs. The project root `/data/` uses the explicitly saved language choice first, then the primary browser language (French → FR, others → EN). The FR/EN selector saves this choice. Explicit language URLs stay unchanged. Without JavaScript, a noscript meta refresh points to English; canonical and fallback links remain present. GitHub Pages cannot provide a custom HTTP 301 from this repository. The host root `/` and `/robots.txt` belong to the separate organization site. Unknown production URLs use the static 404 page. A robots file under `/data/` would not control the host, so the sitemap is submitted directly instead.

Exports retain JSON nesting or select original CSV records using their source identifiers. CSV remains a projection of JSON where the original schema omits nested fields. Missing data stays distinct from zero. Some provider zeros and time-series carry-forwards are conventions, documented on the pages. Dates from Git describe committed file modifications, not source observation dates or uncommitted changes.

## Release checks

The existing GitHub Pages workflow builds and deploys `site/dist`. Before release, run the three validation commands above, inspect French and English pages on desktop and mobile, filter an AI catalog and a time series, reload their URLs and switch languages. No Search Console submission is performed by the build. After authorized deployment, submit `https://digital4better.github.io/data/sitemap.xml` and inspect representative collection/dataset URLs using the property's Search Console access.

## Visualizations

SVG maps and charts use local assets and require no remote map service. Regions sharing coordinates are grouped on the cloud map. Hover, keyboard focus, Enter/Space, and tap reveal the same tooltip; Escape, blur, and leaving the chart dismiss it. Filters update both charts and tables. AI charts count recorded models/capabilities rather than estimating environmental impacts. Numeric comparison charts exclude missing values, preserve zero, separate source units and explicitly limit large catalogs to the 20 highest values. Full results remain in tables and downloads. Basemap provenance is documented in `src/assets/world-map-source.md`.

Temporal maps use only the selected period. Hover/focus previews a territory; click/Enter selects it and updates the URL and detail panel. Neither mix nor factor explorers implicitly select France or the first row. World datasets select their sole world series and do not show a map. The mix map uses a uniform neutral fill to select territories; tooltips show the complete mix for the selected period. Only hover, focus and selection highlight a territory; the green scenario is labeled explicitly. Country maps combine subdivision outlines into one keyboard target. The annual/monthly switch retains the requested year when available and announces any period adjustment. Country filters are discarded when switching cloud regions to hardware schemas, and the active hardware metric is included in the result table.

## Machine access

`site/llms.txt` and `site/llms-full.txt` are static, version-controlled documentation. The build copies them unchanged to `/data/llms.txt` and `/data/llms-full.txt`. The short index links the six editorial collections, bilingual guides and generated JSON catalog; the full reference documents schemas, examples, methodology and the geographic assets available as raw downloads. Public links are absolute. Every editorial page advertises both files in HTML link elements and the footer.

The repository-root `llms.txt` and `llms-full.txt` are separate npm package references with local paths and offline usage examples. Keep shared facts consistent across all four files. Follow `../AGENTS.md` when schemas, file inventory, interpretation rules, sources or public URLs change. No generation script keeps these documents in sync automatically; ordinary value refreshes do not require editing them.

This is discovery assistance, not a guarantee that all LLMs use this emerging format. SSR HTML and source downloads remain the primary interfaces.
