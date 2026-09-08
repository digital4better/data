import { useMapZoom } from "./map-zoom";
import { impactColors, impactColor } from "./chart-data";
import { termLabel, regionLabel, languageStorageKey } from "./localization";
import React, { useEffect, useMemo, useState, useRef, useId } from "react";
import { collections, guides, impacts, fieldLabels, repository, license, tr, datasetTitle } from "./content.mjs";
import { rowsOf, subsetOf, csvSubset, cloudRows, cloudExportRows, Row } from "./data";
import { Bars, CloudMap, CatalogCharts, MixMap, MixHistory, useTooltip } from "./charts";
import { selectedTerritory, rowsAtPeriod, allowedFilters, resolvePeriod, displayPaths } from "./chart-data";
import { Logo } from "./assets/logo";
import "./style.css";
export type Dataset = {
  id: string;
  collection: string;
  file: string;
  csv: boolean;
  count: number;
  fields: string[];
  start?: string;
  end?: string;
  modified: string | null;
  size: number;
};
export type Catalog = { datasets: Dataset[] };
export const languages = ["fr", "en"];
const text = (fr: string, en: string, lang: string) => (lang === "fr" ? fr : en);
const shortLabels: Record<string, string[]> = {
  name: ["Nom", "Name"],
  vendor: ["Éditeur", "Vendor"],
  open: ["Ouvert", "Open"],
  context: ["Contexte (tokens)", "Context (tokens)"],
  input: ["Entrées", "Inputs"],
  output: ["Sorties", "Outputs"],
  reasoning: ["Raisonnement", "Reasoning"],
  tools: ["Outils", "Tools"],
  estimated: ["Estimations", "Estimates"],
  sources: ["Sources", "Sources"],
  pue: ["PUE", "PUE"],
  wue: ["WUE", "WUE"],
  ref: ["REF", "REF"],
  country: ["Pays", "Country"],
  _provider: ["Fournisseur", "Provider"],
  memory: ["Mémoire (GB)", "Memory (GB)"],
  embodied: ["Fabrication (tCO₂e)", "Embodied impact (tCO₂e)"],
  vcpus: ["vCPU", "vCPU"],
  cpu: ["Processeur(s)", "Processor(s)"],
  accelerators: ["Accélérateurs", "Accelerators"],
  cores: ["Cœurs", "Cores"],
  threads: ["Threads", "Threads"],
  tdp: ["TDP (W)", "TDP (W)"],
  process: ["Gravure (nm)", "Process (nm)"],
  id: ["Référence", "Reference"],
  type: ["Type", "Type"],

};
const shortLabel = (key: string, lang: string) => (shortLabels[key] ? tr(shortLabels[key], lang) : label(key, lang));
const mixPercent = (value: unknown, lang: string) => typeof value === "number" && Number.isFinite(value)
  ? new Intl.NumberFormat(lang, { style: "percent", maximumFractionDigits: 2 }).format(value) : "—";
const tableValue = (row: Row, key: string) =>
  key === "_provider" ? cloudProviderLabel(row.datasetId || "") : key === "period" ? row.period : key.startsWith("parameters.") ? row.values.parameters?.[key.split(".")[1]] : row.values[key];
const label = (key: string, lang: string) => key === "period" ? text("Période", "Period", lang) : tr((impacts as any)[key] || (fieldLabels as any)[key] || [termLabel(key, lang), termLabel(key, lang)], lang);
const format = (value: any, lang: string): string =>
  value === null || value === undefined
    ? "—"
    : typeof value === "boolean"
    ? text(value ? "Oui" : "Non", value ? "Yes" : "No", lang)
    : typeof value === "number"
    ? new Intl.NumberFormat(lang, { maximumSignificantDigits: 6 }).format(value)
    : Array.isArray(value)
    ? value.map((v) => format(v, lang)).join(" · ") || "—"
    : typeof value === "object"
    ? JSON.stringify(value)
    : String(value);
const cloudProviderLabel = (id: string) => ({ aws: "AWS", azure: "Microsoft Azure", gcp: "Google Cloud", oracle: "Oracle Cloud", ovhcloud: "OVHcloud", scaleway: "Scaleway" }[id.split("-")[0]] || id);
// Combined views are explorer-only: no synthetic files or catalog pages are published.
function cloudCombinedDatasets(catalog: Catalog): Dataset[] {
  return ["regions", "vms"].flatMap((section) => {
    const datasets = catalog.datasets.filter((d) => d.collection === "cloud" && d.id.endsWith(`-${section}`));
    return datasets.length ? [{ ...datasets[0], id: `all-${section}`, file: "", count: datasets.reduce((n, d) => n + d.count, 0), fields: [...new Set(datasets.flatMap((d) => d.fields))] }] : [];
  });
}
export function App({
  lang = "en",
  route = "",
  catalog,
  base = "/data/",
}: {
  lang?: string;
  route?: string;
  catalog: Catalog;
  base?: string;
}) {
  const t = (fr: string, en: string) => text(fr, en, lang);
  const href = (path = "") => `${base}${lang}/${path ? path + "/" : ""}`;
  const parts = route.split("/");
  const collection = collections.find((c) => c.id === parts[0]);
  const dataset = collection
    ? catalog.datasets.find((d) => d.collection === collection.id && d.id === parts[1])
    : undefined;
  const guide = parts[0] === "guides" ? guides.find((g) => g.id === parts[1]) : undefined;
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => setSearch(window.location.search), []);
  const defaults: Record<string, string> = {
    factor: "country-yearly",
    mix: "country-yearly",
    cloud: "all-regions",
    ai: "models",
    equipment: "energy",
    energy: "energy-impacts",
  };
  const explorerDatasets = [...catalog.datasets, ...cloudCombinedDatasets(catalog)];
  const collectionDataset =
    collection && !dataset
      ? explorerDatasets.find(
          (d) =>
            d.collection === collection.id &&
            d.id === (new URLSearchParams(search).get("dataset") || defaults[collection.id])
        ) || explorerDatasets.find((d) => d.collection === collection.id && d.id === defaults[collection.id])
      : undefined;
  const title = dataset
    ? datasetTitle(dataset.file, lang)
    : collection
    ? tr(collection.title, lang)
    : guide
    ? tr(guide.title, lang)
    : route === "methodology"
    ? t("Méthodologie et sources", "Methodology and sources")
    : route === "reuse"
    ? t("Réutiliser les données", "Reuse the data")
    : t("Des données ouvertes pour comprendre le numérique", "Open data to understand digital technology");
  return (
    <>
      <a className="skip" href="#main">
        {t("Aller au contenu", "Skip to content")}
      </a>
      <header>
        <div className="shell">
          <div className="top">
            <a href={href()} aria-label="Digital4Better Open Data" className="brand">
              <Logo />
              <span>Open Data</span>
            </a>
            <nav aria-label={t("Navigation principale", "Main navigation")}>
              <a href={href()}>{t("Données", "Data")}</a>
              <a href={href("methodology")}>{t("Méthodologie", "Methodology")}</a>
              <a href={href("reuse")}>{t("Réutiliser", "Reuse")}</a>
              <a href={repository}>GitHub ↗</a>
              <span className="languages">
                {languages.map((l) => (
                  <a
                    key={l}
                    href={`${base}${l}/${route ? route + "/" : ""}${search}`}
                    onClick={() => { try { localStorage.setItem(languageStorageKey, l); } catch {} }}
                    hrefLang={l}
                    lang={l}
                    aria-current={lang === l ? "page" : undefined}
                  >
                    {l.toUpperCase()}
                  </a>
                ))}
              </span>
            </nav>
          </div>
          <div className="hero">
            <p className="eyebrow">DIGITAL4BETTER · OPEN DATA</p>
            <h1>{title}</h1>
            <p>
              {collection
                ? tr(collection.description, lang)
                : guide
                ? t(
                    "Les repères essentiels pour interpréter et réutiliser les données.",
                    "Essential guidance for interpreting and reusing the data."
                  )
                : t(
                    "Électricité, cloud, intelligence artificielle et équipements. Six collections documentées, accessibles et réutilisables.",
                    "Electricity, cloud, AI and equipment. Six documented, accessible and reusable collections."
                  )}
            </p>
          </div>
        </div>
      </header>
      <main id="main" className="shell">
        {route && (
          <div className="breadcrumb">
            <a href={href()}>{t("Données", "Data")}</a> /{" "}
            {dataset ? (
              <>
                <a href={href(collection!.id)}>{tr(collection!.title, lang)}</a> / {datasetTitle(dataset.file, lang)}
              </>
            ) : (
              title
            )}
          </div>
        )}
        {!route && (
          <>
            <div className="section-heading">
              <div>
                <p className="eyebrow">{t("LE CATALOGUE", "THE CATALOG")}</p>
                <h2>{t("Explorer les collections", "Explore the collections")}</h2>
              </div>
              <label>
                {t("Rechercher", "Search")}
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("Cloud, modèles, électricité…", "Cloud, models, electricity…")}
                />
              </label>
            </div>
            <div className="cards">
              {collections
                .filter((c) =>
                  (tr(c.title, lang) + " " + tr(c.description, lang)).toLowerCase().includes(query.toLowerCase())
                )
                .map((c, i) => (
                  <a className="card collection" key={c.id} href={href(c.id)}>
                    <div className="card-meta">
                      <span>0{collections.indexOf(c) + 1}</span>
                      <span>
                        {catalog.datasets.filter((d) => d.collection === c.id).length}{" "}
                        {catalog.datasets.filter((d) => d.collection === c.id).length === 1
                          ? t("jeu", "dataset")
                          : t("jeux", "datasets")}
                      </span>
                    </div>
                    <h3>{tr(c.title, lang)}</h3>
                    <p>{tr(c.description, lang)}</p>
                    <span className="action">
                      {t("Explorer les données", "Explore data")} <span aria-hidden>→</span>
                    </span>
                  </a>
                ))}
            </div>
            {!collections.some((c) =>
              (tr(c.title, lang) + " " + tr(c.description, lang)).toLowerCase().includes(query.toLowerCase())
            ) && <p role="status">{t("Aucune collection trouvée.", "No collections found.")}</p>}
            <div className="callout">
              <h2>{t("Des références à réutiliser", "Reference data for reuse")}</h2>
              <p>
                {t(
                  "Téléchargez les fichiers CSV et JSON, consultez les hypothèses et citez vos sources. Accès libre, sans compte.",
                  "Download CSV and JSON files, review assumptions and cite your sources. Open access, no account required."
                )}
              </p>
              <a href={href("reuse")}>{t("Comment utiliser ces données", "How to use the data")} →</a>
            </div>
            <GuideLinks lang={lang} href={href} />
          </>
        )}
        {collection && !dataset && (
          <>
            {collectionDataset && (
              <Explorer
                key={collectionDataset.collection + "/" + collectionDataset.id}
                dataset={collectionDataset}
                catalog={catalog}
                base={base}
                lang={lang}
                href={href}
                collectionView
              />
            )}
            <section className="card intro">
              <h2>{t("À quoi servent ces données ?", "What are these data for?")}</h2>
              <p>{tr(collection.use, lang)}</p>
              <p>{tr(collection.unit, lang)}</p>
              <a href="#datasets">{t("Accéder aux fichiers", "Browse the files")} ↓</a>
            </section>
            <section id="datasets">
              <div className="section-heading">
                <h2>{t("Jeux de données et téléchargements", "Datasets and downloads")}</h2>
                <span>CSV · JSON · ODbL</span>
              </div>
              <div className="dataset-list">
                {catalog.datasets
                  .filter((d) => d.collection === collection.id)
                  .map((d) => (
                    <div className="card dataset-row" key={d.id}>
                      <div>
                        <a className="dataset-name" href={href(`${collection.id}/${d.id}`)}>
                          {datasetTitle(d.file, lang)}
                        </a>
                        <p>
                          {d.count.toLocaleString(lang)} {t("entrées", "entries")}
                          {d.start ? ` · ${d.start} → ${d.end}` : ""}
                        </p>
                      </div>
                      <Downloads dataset={d} base={base} lang={lang} />
                    </div>
                  ))}
              </div>
            </section>
            <Notes collection={collection} lang={lang} />
            <GuideLinks lang={lang} href={href} collection={collection.id} />
          </>
        )}
        {dataset && (
          <>
            <section className="card">
              <div className="section-heading">
                <h2>{t("Télécharger le jeu complet", "Download the full dataset")}</h2>
                <Downloads dataset={dataset} base={base} lang={lang} />
              </div>
              <p>{tr(collection!.use, lang)}</p>
              <dl className="facts">
                <div>
                  <dt>{t("Entrées", "Entries")}</dt>
                  <dd>{dataset.count.toLocaleString(lang)}</dd>
                </div>
                <div>
                  <dt>{t("Période couverte", "Period covered")}</dt>
                  <dd>
                    {dataset.start
                      ? `${dataset.start} → ${dataset.end}`
                      : t("Sans série temporelle", "Not a time series")}
                  </dd>
                </div>
                <div>
                  <dt>{t("Modification Git du fichier", "File Git modification")}</dt>
                  <dd>{dataset.modified || t("Non renseignée", "Not recorded")}</dd>
                </div>
                <div>
                  <dt>{t("Actualisation des sources", "Source refresh")}</dt>
                  <dd>{t("Non renseignée par entrée", "Not recorded per entry")}</dd>
                </div>
              </dl>
              <p className="muted">
                {t(
                  "La date Git correspond à la dernière modification enregistrée, pas nécessairement aux changements locaux ni à de nouvelles observations.",
                  "The Git date reflects the last committed change, not necessarily local edits or new observations."
                )}
              </p>
              <p>{tr(collection!.unit, lang)}</p>
            </section>
            <Explorer
              key={dataset.collection + "/" + dataset.id}
              dataset={dataset}
              catalog={catalog}
              base={base}
              lang={lang}
              href={href}
            />
            <Notes collection={collection} lang={lang} />
            <section className="card">
              <h2>{t("Dictionnaire des champs", "Field dictionary")}</h2>
              {["factor", "mix"].includes(dataset.collection) && (
                <p>
                  {t(
                    "Structure JSON : territoire → période → indicateurs ; au niveau mondial : période → indicateurs. Les CSV exposent ces clés en colonnes.",
                    "JSON structure: territory → period → indicators; world level: period → indicators. CSV exposes these keys as columns."
                  )}
                </p>
              )}
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>{t("Champ", "Field")}</th>
                      <th>{t("Définition", "Definition")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataset.fields.map((f) => (
                      <tr key={f}>
                        <td>
                          <code>{f}</code>
                        </td>
                        <td>
                          {dataset.collection === "mix"
                            ? t("Part de " + f + " entre 0 et 1", "Share of " + f + " between 0 and 1")
                            : label(f, lang) === f
                            ? t(
                                "Champ source « " +
                                  f +
                                  " » ; interprétation et unité à vérifier dans les références avant calcul.",
                                "Source field “" +
                                  f +
                                  "”; verify interpretation and units in references before calculation."
                              )
                            : label(f, lang)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <Reuse lang={lang} dataset={dataset} base={base} />
            <GuideLinks lang={lang} href={href} collection={collection!.id} />
          </>
        )}
        {guide && (
          <article className="card prose">
            {guide.sections.map((s, i) => (
              <section key={i}>
                <h2>{tr(s[0], lang)}</h2>
                <p>{tr(s[1], lang)}</p>
              </section>
            ))}
            <a href={href(guide.collection)}>
              {t("Explorer la collection associée", "Explore the related collection")} →
            </a>
          </article>
        )}
        {route === "methodology" && (
          <>
            <section className="card prose">
              <h2>
                {t("Des références documentées, des limites explicites", "Documented references, explicit limits")}
              </h2>
              <p>
                {t(
                  "Ces collections réunissent publications fournisseurs, travaux de cycle de vie et données publiques. Le générateur transforme certaines sources en facteurs dérivés. Une reconstruction quotidienne ne signifie pas que toutes les sources ont été actualisées.",
                  "These collections combine provider disclosures, lifecycle studies and public data. The generator transforms some sources into derived factors. A daily rebuild does not mean all sources were refreshed."
                )}
              </p>
              <p>
                {t(
                  "Une absence est affichée par un tiret, jamais convertie en zéro. Les zéros déjà présents dans les fichiers sont conservés ; certaines collections utilisent zéro comme convention. Les compléments et reports temporels ne sont pas marqués individuellement dans les séries actuelles.",
                  "Missing values appear as a dash and are never converted to zero. Zeros already in files are preserved; some collections use zero as a convention. Filled and carried-forward values are not individually flagged in the current series."
                )}
              </p>
              <p><ImpactMethodologyLink lang={lang} /></p>
              <a href={repository + "/blob/main/index.ts"}>
                {t("Consulter la méthode de génération", "Read the generation method")} ↗
              </a>
            </section>
            {collections.map((c) => (
              <Notes key={c.id} collection={c} lang={lang} />
            ))}
            <GuideLinks lang={lang} href={href} />
          </>
        )}
        {route === "reuse" && (
          <>
            <Reuse lang={lang} base={base} />
            <section className="card prose">
              <h2>{t("Choisir son format", "Choose a format")}</h2>
              <p>
                {t(
                  "JSON préserve la structure imbriquée. CSV convient aux tableurs et outils BI ; les listes peuvent y être séparées par | et certains champs imbriqués ne sont disponibles qu’en JSON. Les exports filtrés conservent la structure du format source.",
                  "JSON preserves nested structure. CSV works with spreadsheets and BI tools; lists may use | separators and some nested fields are only available in JSON. Filtered exports retain the source format structure."
                )}
              </p>
              <h2>{t("Reproduire une analyse", "Reproduce an analysis")}</h2>
              <p>
                {t(
                  "Conservez le fichier utilisé, sa période et la référence du commit Git. Les URL publiques pointent vers des fichiers susceptibles d’être actualisés. Pour figer une analyse, utilisez un lien GitHub vers un commit précis.",
                  "Keep the file used, its period and the Git commit reference. Public URLs point to files that can change. To pin an analysis, use a GitHub link to a specific commit."
                )}
              </p>
            </section>
            <GuideLinks lang={lang} href={href} />
          </>
        )}
      </main>
      <footer>
        <div className="shell">
          <strong>Digital4Better · Open Data</strong>
          <p>
            {t(
              "Données ouvertes pour un numérique plus responsable.",
              "Open data for more sustainable digital services."
            )}
          </p>
          <div className="footer-links">
            <a href={license}>ODbL 1.0</a>
            <a href={`${base}catalog.json`}>{t("Catalogue JSON", "JSON catalog")}</a>
            <a href={`${base}llms.txt`}>llms.txt</a>
            <a href={`${base}sitemap.xml`}>{t("Plan du site", "Sitemap")}</a>
            <a href={repository + "/issues"}>{t("Signaler une erreur", "Report an issue")}</a>
            <a href="https://digital4better.com">Digital4Better ↗</a>
            <a href="https://www.fruggr.io">Fruggr ↗</a>
          </div>
        </div>
      </footer>
    </>
  );
}
function Downloads({ dataset: d, base, lang }: { dataset: Dataset; base: string; lang: string }) {
  return (
    <div className="downloads">
      {["json", ...(d.csv ? ["csv"] : [])].map((ext) => (
        <a
          key={ext}
          download
          href={`${base}${d.collection}/${d.id}.${ext}`}
          aria-label={`${text("Télécharger", "Download", lang)} ${d.id} ${ext.toUpperCase()}`}
        >
          {ext.toUpperCase()} ↓
        </a>
      ))}
    </div>
  );
}
function ImpactMethodologyLink({ lang }: { lang: string }) {
  return (
    <a href={`https://digital4better.github.io/methodology/${lang === "en" ? "en/" : ""}`}>
      {text("Méthodologie d’évaluation des impacts environnementaux", "Environmental impact assessment methodology", lang)} ↗
    </a>
  );
}
function Notes({ collection: c, lang }: { collection: any; lang: string }) {
  return (
    <section className="card prose" id={`sources-${c.id}`}>
      <h2>{text("Sources et précautions", "Sources and limitations", lang)}</h2>
      <h3>{tr(c.title, lang)}</h3>
      <p>{tr(c.limits, lang)}</p>
      {c.id === "factor" && (
        <p>
          {text(
            "La variante green utilise le mix renouvelable renormalisé. Elle ne représente pas une mesure contractuelle ni un impact nul.",
            "The green variant uses the renormalized renewable mix. It does not represent contractual measurements or zero impact.",
            lang
          )}
        </p>
      )}
      <ul>
        {c.id === "factor" && <li><ImpactMethodologyLink lang={lang} /></li>}
        {c.sources.map(([title, url]: string[]) => (
          <li key={url}>
            <a href={url}>{title.includes(" / ") ? title.split(" / ")[lang === "fr" ? 0 : 1] : title} ↗</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
function GuideLinks({ lang, href, collection }: { lang: string; href: (p: string) => string; collection?: string }) {
  if (!guides.some((g) => !collection || g.collection === collection)) return null;
  return (
    <section>
      <h2>{text("Comprendre et réutiliser", "Understand and reuse", lang)}</h2>
      <div className="guide-links">
        {guides
          .filter((g) => !collection || g.collection === collection)
          .map((g) => (
            <a className="card" key={g.id} href={href("guides/" + g.id)}>
              {tr(g.title, lang)} →
            </a>
          ))}
      </div>
    </section>
  );
}
function Reuse({ lang, dataset, base }: { lang: string; dataset?: Dataset; base: string }) {
  const [copied, setCopied] = useState(false);
  const attribution = `Digital4Better Open Data${
    dataset ? " — " + dataset.collection + "/" + dataset.file : ""
  } · ODbL 1.0 · ${repository}`;
  return (
    <section className="card prose">
      <h2>{text("Réutiliser et citer", "Reuse and cite", lang)}</h2>
      <p>
        {text(
          "Ces données sont publiées sous licence ODbL 1.0. Consultez le texte de la licence pour les conditions de réutilisation, d’attribution et de partage.",
          "These data are published under ODbL 1.0. Read the license for reuse, attribution and sharing conditions.",
          lang
        )}{" "}
        <a href={license}>ODbL 1.0 ↗</a>
      </p>
      <blockquote>{attribution}</blockquote>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(attribution);
            setCopied(true);
          } catch {
            setCopied(false);
          }
        }}
      >
        {text("Copier l’attribution", "Copy attribution", lang)}
      </button>
      <span role="status">{copied ? text(" Attribution copiée.", " Attribution copied.", lang) : ""}</span>
      <h3>{text("Exemple JavaScript", "JavaScript example", lang)}</h3>
      <pre>
        <code>{`const response = await fetch("https://digital4better.github.io${base}${
          dataset ? dataset.collection + "/" + dataset.file : "factor/country-yearly.json"
        }");\nif (!response.ok) throw new Error(String(response.status));\nconst data = await response.json();\nconsole.log(data);`}</code>
      </pre>
      <a href={repository + "/issues"}>
        {text("Signaler une erreur ou proposer une correction", "Report an issue or suggest a correction", lang)} ↗
      </a>
    </section>
  );
}
function Explorer({
  dataset: d,
  catalog,
  base,
  lang,
  href,
  collectionView = false,
}: {
  collectionView?: boolean;
  dataset: Dataset;
  catalog: Catalog;
  base: string;
  lang: string;
  href: (p: string) => string;
}) {
  const t = (fr: string, en: string) => text(fr, en, lang);
  const cloudSections = [
    { id: "regions", title: t("Régions", "Regions") },
    { id: "vms", title: t("Machines virtuelles", "Virtual machines") },
    { id: "cpus", title: t("Processeurs", "Processors") },
    { id: "accelerators", title: t("Accélérateurs", "Accelerators") },
  ];
  const cloudSection = d.id.endsWith("regions") ? "regions" : d.id.endsWith("vms") ? "vms" : d.id;
  const cloudDatasets = catalog.datasets.filter((x) => x.collection === "cloud");
  const providerDatasets = cloudDatasets.filter((x) => x.id.endsWith(`-${cloudSection}`));
  const providerLabel = cloudProviderLabel;
  const allCloud = d.collection === "cloud" && d.id.startsWith("all-");
  const sectionDataset = (section: string) => {
    const matching = cloudDatasets.filter((x) => x.id === section || x.id.endsWith(`-${section}`));
    if (["regions", "vms"].includes(section) && (allCloud || !["regions", "vms"].includes(cloudSection))) return `all-${section}`;
    return matching.find((x) => x.id.split("-")[0] === d.id.split("-")[0])?.id || matching[0]?.id;
  };
  const changeDataset = (id: string) => {
    const params = new URLSearchParams(location.search);
    if (d.collection === "cloud" && !id.endsWith(`-${cloudSection}`) && id !== cloudSection)
      for (const key of ["q", "metric", "sort", "direction"]) params.delete(key);
    for (const key of ["vendor", "input", "output", "open", "reasoning", "tools", "context", "country"])
      if (!allowedFilters(d.collection, id).includes(key)) params.delete(key);
    if (d.id.split("-")[0] !== id.split("-")[0]) params.delete("region");
    if (!["factor", "mix"].includes(d.collection)) {
      params.delete("region");
      params.delete("period");
    }
    const useCollection = collectionView || id.startsWith("all-");
    if (useCollection) params.set("dataset", id);
    else params.delete("dataset");
    location.assign(
      href(useCollection ? d.collection : `${d.collection}/${id}`) + (params.size ? "?" + params.toString() : "")
    );
  };
  const hasDetailPanel = d.collection === "ai" || d.collection === "equipment" || (d.collection === "cloud" && !d.id.endsWith("regions"));
  const [detailRow, setDetailRow] = useState<Row | null>(null);
  const temporal = ["factor", "mix"].includes(d.collection);
  const world = d.id.startsWith("world-");
  const [source, setSource] = useState<any>(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [period, setPeriod] = useState("");
  const [metric, setMetric] = useState("");
  const [region, setRegion] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState({ key: "", direction: 1 });
  const [page, setPage] = useState(0);
  const [ready, setReady] = useState(false);
  const [paths, setPaths] = useState<Record<string, string>>({});
  const [names, setNames] = useState<Record<string, string>>({});
  const [exportError, setExportError] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQ(params.get("q") || "");
    setPeriod(params.get("period") || "");
    setMetric(params.get("metric") || "");
    setRegion(params.get("region") || "");
    setSort({ key: params.get("sort") || "", direction: params.get("direction") === "-1" ? -1 : 1 });
    setFilters(Object.fromEntries(allowedFilters(d.collection, d.id).map((k) => [k, params.get(k) || ""])));
    setReady(true);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setError("");
    const load = async (dataset: Dataset) => {
      const response = await fetch(`${base}${dataset.collection}/${dataset.file}`, { signal: controller.signal });
      if (!response.ok) throw new Error(String(response.status));
      return response.json();
    };
    (allCloud
      ? Promise.all(providerDatasets.map(async (dataset) => [dataset.id, await load(dataset)] as const)).then(Object.fromEntries)
      : load(d))
      .then(setSource)
      .catch((e) => {
        if (e.name !== "AbortError")
          setError(
            t(
              "Impossible de charger les données. Les fichiers complets restent accessibles ci-dessus.",
              "Unable to load data. Full files remain available above."
            )
          );
      });
    return () => controller.abort();
  }, [d.id, d.file]);
  useEffect(() => {
    if (!temporal) return;
    let active = true;
    fetch(`${base}country/regions.json`)
      .then((r) => r.json())
      .then((rows) => {
        if (active)
          setNames(
            Object.fromEntries(
              rows.map((r: any) => [
                r.type === "continent" ? r.name : r.subdivision ? `${r["alpha-2"]}-${r.subdivision}` : r["alpha-2"],
                regionLabel(r.type === "continent" ? r.name : r.subdivision ? `${r["alpha-2"]}-${r.subdivision}` : r["alpha-2"], r.name, lang),
              ])
            )
          );
      })
      .catch(() => {});
    if (["factor", "mix"].includes(d.collection) && /^(country|subdivision)-/.test(d.id))
      fetch(`${base}country/regions-paths.json`)
        .then((r) => r.json())
        .then((p) => {
          if (active) setPaths(p);
        })
        .catch(() => {});
    return () => {
      active = false;
    };
  }, [d.id]);
  const rows = useMemo(() => {
    if (!source) return [];
    if (allCloud) return cloudRows(source);
    const loaded = rowsOf(source, temporal, world);
    return d.collection === "cloud" ? loaded.map((row) => ({ ...row, datasetId: d.id })) : loaded;
  }, [source, allCloud, d.id]);
  const arraySource = allCloud || Array.isArray(source);
  const periods = useMemo(
    () =>
      Array.from(new Set(rows.map((r) => r.period).filter(Boolean)))
        .sort()
        .reverse() as string[],
    [rows]
  );
  const activePeriod = d.collection === "mix" ? periods[0] || "" : resolvePeriod(period, periods);
  const numeric = d.fields.filter((k) => rows.some((r) => typeof r.values[k] === "number"));
  const activeMetric = numeric.includes(metric) ? metric : numeric.includes("gwp") ? "gwp" : numeric[0] || "";
  useEffect(() => {
    if (!ready || !source) return;
    const params = new URLSearchParams();
    Object.entries({
      dataset: collectionView ? d.id : "",
      q,
      period: d.collection === "factor" ? activePeriod : "",
      metric: d.collection === "mix" || d.collection === "ai" || (d.collection === "cloud" && ["regions", "vms"].includes(cloudSection)) ? "" : d.collection === "cloud" ? (numeric.includes(metric) ? metric : "") : activeMetric,
      region: world ? "" : region,
      ...filters,
      sort: sort.key,
      direction: sort.key ? String(sort.direction) : "",
    }).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    history.replaceState(null, "", location.pathname + (params.size ? "?" + params.toString() : ""));
    document.querySelectorAll<HTMLAnchorElement>(".languages a").forEach((a) => {
      a.href = a.href.split("?")[0] + (params.size ? "?" + params.toString() : "");
    });
  }, [q, activePeriod, activeMetric, metric, region, filters, sort, ready, source]);
  const matches = (r: Row, includeRegion = true) => {
    if (q && !`${r.key} ${r.datasetId ? providerLabel(r.datasetId) : ""} ${names[r.key] || ""} ${termLabel(r.key, lang)} ${Object.values(r.values).flat().map((v) => typeof v === "string" ? termLabel(v, lang) : "").join(" ")} ${JSON.stringify(r.values)}`.toLowerCase().includes(q.toLowerCase()))
      return false;
    if (includeRegion && region && !world && r.key !== region) return false;
    return Object.entries(filters).every(
      ([k, v]) =>
        !v ||
        (k === "context"
          ? typeof r.values.context === "number" && r.values.context >= Number(v)
          : Array.isArray(r.values[k])
          ? r.values[k].includes(v)
          : String(r.values[k]) === v)
    );
  };
  const periodRows = useMemo(() => temporal ? rowsAtPeriod(rows, activePeriod) : rows, [rows, activePeriod, temporal]);
  const mapRows = useMemo(() => periodRows.filter((r) => matches(r, false)), [periodRows, q, names, filters, lang]);
  const filtered = (d.collection === "mix" ? rows : periodRows).filter((r) => matches(r));
  const sorted = [...filtered].sort((a, b) => {
    if (!sort.key && d.collection === "mix") return (b.period || "").localeCompare(a.period || "") || a.key.localeCompare(b.key);
    const av = sort.key === "_key" ? a.key : tableValue(a, sort.key);
    const bv = sort.key === "_key" ? b.key : tableValue(b, sort.key);
    if (av == null) return bv == null ? 0 : 1;
    if (bv == null) return -1;
    return (
      sort.direction *
      (typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv), lang))
    );
  });
  useEffect(() => setPage(0), [q, activePeriod, activeMetric, region, filters, sort]);
  const baseColumns = d.collection === "mix"
    ? ["period", ...d.fields]
    : temporal
    ? [activeMetric]
    : d.collection === "ai"
    ? ["name", "vendor", "open", "architecture", "parameters.active", "parameters.total", "context", "input", "output", "reasoning", "tools"]
    : d.collection === "cloud"
    ? d.id.endsWith("regions")
      ? ["id", "country", "location", "pue", "wue", "ref"]
      : d.id.endsWith("vms")
      ? ["name", "category", "vcpus", "memory", "cpu", "accelerators", "embodied"]
      : d.id === "cpus"
      ? ["id", "manufacturer", "architecture", "cores", "threads", "tdp", "process"]
      : ["id", "manufacturer", "type", "memory", "tdp", "process"]
    : d.fields.filter((k) => !numeric.includes(k) || k === activeMetric);
  const columns =
    d.collection === "cloud" && !["regions", "vms"].includes(cloudSection) && numeric.includes(metric) && !baseColumns.includes(metric)
      ? [...baseColumns, metric]
      : baseColumns;
  const tableColumns = d.collection === "cloud" && ["regions", "vms"].includes(cloudSection) ? ["_provider", ...columns] : columns;
  const filterFields =
    d.collection === "ai"
      ? ["vendor", "input", "output", "open", "reasoning", "tools"]
      : d.collection === "cloud" && d.id.endsWith("regions")
      ? ["country"]
      : [];
  const options = (k: string) =>
    Array.from(
      new Set(
        rows.flatMap((r) =>
          r.values[k] == null ? [] : Array.isArray(r.values[k]) ? r.values[k].map(String) : [String(r.values[k])]
        )
      )
    ).sort() as string[];
  const regions = Array.from(new Set(rows.map((r) => r.key))).sort();
  const chartRegion = selectedTerritory(region, world);
  const selectedRow = periodRows.find((r) => r.key === chartRegion && matches(r));
  const historyRows = rows.filter((r) => r.key === chartRegion).sort((a, b) => a.period!.localeCompare(b.period!));
  async function download(ext: string, exportDataset = d) {
    setExportError("");
    try {
      const exportSource = allCloud ? source[exportDataset.id] : source;
      const exportRows = allCloud ? cloudExportRows(filtered, exportDataset.id) : filtered;
      let content: string;
      if (ext === "json") content = JSON.stringify(subsetOf(exportSource, exportRows, temporal, world), null, 2);
      else {
        const response = await fetch(`${base}${exportDataset.collection}/${exportDataset.id}.csv`);
        if (!response.ok) throw new Error();
        content = csvSubset(await response.text(), exportSource, exportRows, temporal, world);
      }
      const url = URL.createObjectURL(
        new Blob([content], { type: ext === "json" ? "application/json" : "text/csv;charset=utf-8" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `${exportDataset.id}-filtered.${ext}`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setExportError(t("Échec de l’export. Réessayez.", "Export failed. Try again."));
    }
  }
  return (
    <section className="card explorer">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t("APERÇU INTERACTIF", "INTERACTIVE PREVIEW")}</p>
          <h2>{t("Explorer les données", "Explore data")}</h2>
        </div>
        {temporal && (
          <a
            href={href(`${d.collection === "factor" ? "mix" : "factor"}/${d.id}`)}
            onClick={(e) => {
              e.preventDefault();
              location.assign(e.currentTarget.href + location.search);
            }}
          >
            {d.collection === "factor"
              ? t("Voir le mix associé", "View associated mix")
              : t("Voir les facteurs associés", "View associated factors")}{" "}
            →
          </a>
        )}
      </div>
      {d.collection === "cloud" && (
        <div className="cloud-navigation">
          <nav className="cloud-sections" aria-label={t("Catégories d’infrastructure", "Infrastructure categories")}>
            {cloudSections.map((section) => {
              const target = sectionDataset(section.id);
              return target ? <a key={section.id}
                href={collectionView || target.startsWith("all-") ? `${href("cloud")}?dataset=${target}` : href(`cloud/${target}`)}
                aria-current={cloudSection === section.id ? "page" : undefined}
                onClick={(event) => {
                  if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  event.preventDefault();
                  changeDataset(target);
                }}>{section.title}</a> : null;
            })}
          </nav>
        </div>
      )}
      <noscript>
        <style>{`.preview-loading { display: none; }`}</style>
        <p>
          {t(
            "Activez JavaScript pour filtrer les données. Les descriptions et fichiers complets restent disponibles.",
            "Enable JavaScript to filter data. Descriptions and complete files remain available."
          )}
        </p>
      </noscript>
      {error ? (
        <p role="alert">{error}</p>
      ) : !source ? (
        <p className="preview-loading" role="status">{t("Chargement de l’aperçu…", "Loading preview…")}</p>
      ) : (
        <>
          <div className="filters">
            {d.collection === "cloud" && providerDatasets.length > 1 && <label className="cloud-provider">
              {t("Fournisseur", "Provider")}
              <select value={d.id} onChange={(event) => changeDataset(event.target.value)}>
                <option value={`all-${cloudSection}`}>{t("Tous", "All")}</option>
                {providerDatasets.map((x) => <option key={x.id} value={x.id}>{providerLabel(x.id)}</option>)}
              </select>
            </label>}
            <label>
              {t("Rechercher", "Search")}
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("Nom, identifiant, pays…", "Name, identifier, country…")}
              />
            </label>
            {d.collection === "equipment" && (
              <label>
                {t("Jeu de données", "Dataset")}
                <select value={d.id} onChange={(e) => changeDataset(e.target.value)}>
                  {catalog.datasets
                    .filter((x) => x.collection === d.collection)
                    .map((x) => (
                      <option key={x.id} value={x.id}>
                        {datasetTitle(x.file, lang)}
                      </option>
                    ))}
                </select>
              </label>
            )}
            {temporal && (
              <>
                <label>
                  {t("Jeu / fréquence", "Dataset / frequency")}
                  <select value={d.id} onChange={(e) => changeDataset(e.target.value)}>
                    {catalog.datasets
                      .filter((x) => x.collection === d.collection)
                      .map((x) => (
                        <option key={x.id} value={x.id}>
                          {datasetTitle(x.file, lang)}
                        </option>
                      ))}
                  </select>
                </label>
                {d.collection !== "mix" && <label>
                  {t("Période", "Period")}
                  <select value={activePeriod} onChange={(e) => setPeriod(e.target.value)}>
                    {periods.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </label>}
                {!world && (
                  <label>
                    {t("Territoire", "Territory")}
                    <select value={region} onChange={(e) => setRegion(e.target.value)}>
                      <option value="">{t("Tous", "All")}</option>
                      {region && !regions.includes(region) && <option value={region}>{names[region] || region}</option>}
                      {regions.map((r) => (
                        <option key={r} value={r}>
                          {names[r] || r} ({r})
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </>
            )}
            {numeric.length > 0 && d.collection !== "mix" && d.collection !== "ai" && !(d.collection === "cloud" && ["regions", "vms"].includes(cloudSection)) && (
              <label>
                {d.collection === "cloud" ? t("Colonne complémentaire", "Additional column") : t("Indicateur", "Indicator")}
                <select value={d.collection === "cloud" ? (numeric.includes(metric) ? metric : "") : activeMetric} onChange={(e) => setMetric(e.target.value)}>
                  {d.collection === "cloud" && <option value="">{t("Aucune", "None")}</option>}
                  {numeric.map((k) => (
                    <option key={k} value={k}>
                      {label(k, lang)}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {filterFields.map((k) => (
              <label key={k}>
                {shortLabel(k, lang)}
                <select value={filters[k] || ""} onChange={(e) => setFilters({ ...filters, [k]: e.target.value })}>
                  <option value="">{t("Tous", "All")}</option>
                  {options(k).map((v) => (
                    <option key={v} value={v}>
                      {v === "true" ? t("Oui", "Yes") : v === "false" ? t("Non", "No") : k === "country" ? regionLabel(v.toUpperCase(), v, lang) : termLabel(v, lang)}
                    </option>
                  ))}
                </select>
              </label>
            ))}
            {d.collection === "ai" && (
              <label>
                {t("Contexte minimum (tokens)", "Minimum context (tokens)")}
                <input
                  type="number"
                  min="0"
                  value={filters.context || ""}
                  onChange={(e) => setFilters({ ...filters, context: e.target.value })}
                />
              </label>
            )}
            <button
              onClick={() => {
                setQ("");
                setPeriod("");
                setRegion("");
                setMetric("");
                setFilters({});
                setSort({ key: "", direction: 1 });
              }}
            >
              {t("Réinitialiser", "Reset")}
            </button>
          </div>
          {d.collection === "factor" && /^(country|subdivision)-/.test(d.id) && (
            <FactorMap
              paths={paths}
              rows={mapRows}
              metric={activeMetric}
              lang={lang}
              names={names}
              period={activePeriod}
              selected={region}
              onSelect={setRegion}
              countryLevel={d.id.startsWith("country-")}
            />
          )}
          {d.collection === "cloud" && d.id.endsWith("regions") && <CloudMap rows={filtered} lang={lang} />}
          {d.collection === "mix" && /^(country|subdivision)-/.test(d.id) && (
            <MixMap
              paths={paths}
              rows={mapRows}
              period={activePeriod}
              names={names}
              lang={lang}
              selected={region}
              onSelect={setRegion}
              countryLevel={d.id.startsWith("country-")}
              green={d.id.endsWith("-green")}
            />
          )}
          {d.collection === "factor" && period && period !== activePeriod && (
            <p role="status">
              {t(
                "Période demandée indisponible dans ce jeu ; période affichée : ",
                "Requested period unavailable in this dataset; showing: "
              )}
              {activePeriod}.
            </p>
          )}
          {temporal && (
            <aside className="notice" aria-label={t("À propos des données", "About the data")}>
              <strong>{t("À propos des données", "About the data")}</strong>
              <p>
                {activePeriod === String(new Date().getUTCFullYear())
                  ? t("Année en cours : données annuelles partielles. ", "Current year: partial annual data. ")
                  : ""}
                {t(
                  "Certaines valeurs manquantes sont complétées, notamment en reprenant une période précédente. Les données ne permettent pas de vérifier que toutes les observations sont disponibles.",
                  "Some missing values are filled in, including by carrying forward values from a previous period. The data does not indicate whether all observations are available."
                )}
              </p>
              <a href={`#sources-${d.collection}`}>
                {t("Comprendre les sources et les limites", "Understand the sources and limitations")}
              </a>
            </aside>
          )}
          {temporal && !world && !chartRegion && (
            <p className="selection-prompt">
              {t(
                "Sélectionnez un territoire sur la carte ou dans le filtre pour explorer son détail et son évolution.",
                "Select a territory on the map or in the filter to explore its detail and history."
              )}
            </p>
          )}
          {d.collection === "factor" && chartRegion && (
            <section className="selected-territory">
              <div className="section-heading">
                <h3>
                  {world ? t("Monde", "World") : names[chartRegion] || chartRegion} · {activePeriod}
                </h3>
                {!world && (
                  <button onClick={() => setRegion("")}>{t("Effacer la sélection", "Clear selection")}</button>
                )}
              </div>
              {!selectedRow ? (
                <p role="status">
                  {t(
                    "Aucune donnée pour ce territoire avec la période et les filtres sélectionnés.",
                    "No data for this territory with the selected period and filters."
                  )}
                </p>
              ) : (
                <p>
                  {label(activeMetric, lang)} / kWh : <strong>{format(selectedRow.values[activeMetric], lang)}</strong>
                </p>
              )}
            </section>
          )}
          {d.collection === "factor" && d.id.startsWith("continent-") && (
            <Bars
              title={`${label(activeMetric, lang)} / kWh · ${activePeriod}`}
              items={mapRows
                .filter((r) => typeof r.values[activeMetric] === "number")
                .map((r) => ({ name: names[r.key] || r.key, value: r.values[activeMetric] }))}
              lang={lang}
            />
          )}
          {!temporal && d.collection !== "cloud" && filtered.length > 0 && (
            <CatalogCharts
              rows={filtered}
              collection={d.collection}
              metric={activeMetric}
              metricLabel={label(activeMetric, lang) + (d.collection === "energy" ? " / kWh" : "")}
              lang={lang}
            />
          )}
          {d.collection === "mix" && historyRows.length > 0 && <MixHistory rows={historyRows} lang={lang}
            name={chartRegion === "world" ? t("Monde", "World") : names[chartRegion!] || chartRegion!} />}
          {d.collection === "factor" && historyRows.length > 0 && (
            <details className="history">
              <summary>
                {t("Évolution temporelle", "Time evolution")} ·{" "}
                {chartRegion === "world" ? t("Monde", "World") : names[chartRegion!] || chartRegion} ·{" "}
                {label(activeMetric, lang)}
              </summary>
              <Trend
                rows={historyRows}
                metric={activeMetric}
                lang={lang}
                unit={label(activeMetric, lang) + " / kWh"}
              />
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>{t("Période", "Period")}</th>
                      {[activeMetric].map(k => <th key={k} scope="col">{label(k, lang)}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {historyRows.map((r) => (
                      <tr key={r.period}>
                        <td>{r.period}</td>
                        {[activeMetric].map(k => <td key={k}>{format(r.values[k], lang)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}
          <div className={`section-heading${allCloud ? " cloud-export-heading" : ""}`}>
            <p role="status">
              {filtered.length.toLocaleString(lang)} {t("résultats", "results")}
            </p>
            <div className="downloads">
              {allCloud ? <details className="cloud-exports">
                <summary>{t("Exporter la sélection par fournisseur", "Export selection by provider")}</summary>
                <p>{t("Chaque fichier conserve le format de sa source et les filtres actifs.", "Each file preserves its source format and the active filters.")}</p>
                {providerDatasets.map((dataset) => <div key={dataset.id}>
                  <strong>{providerLabel(dataset.id)}</strong>{" "}
                  {["json", ...(dataset.csv ? ["csv"] : [])].map((ext) => <button key={ext}
                    disabled={!filtered.some((row) => row.datasetId === dataset.id)}
                    onClick={() => download(ext, dataset)}
                    aria-label={`${t("Exporter", "Export")} ${providerLabel(dataset.id)} ${ext.toUpperCase()}`}>
                    {ext.toUpperCase()}
                  </button>)}
                </div>)}
              </details> : <>
              <button disabled={!filtered.length} onClick={() => download("json")}>
                {t("Exporter la sélection JSON", "Export selection JSON")}
              </button>
              {d.csv && (
                <button disabled={!filtered.length} onClick={() => download("csv")}>
                  {t("Exporter la sélection CSV", "Export selection CSV")}
                </button>
              )}
              </>}
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(location.href);
                    setExportError(t("Lien copié.", "Link copied."));
                  } catch {
                    setExportError(
                      t("Copiez l’adresse dans la barre du navigateur.", "Copy the address from your browser bar.")
                    );
                  }
                }}
              >
                {t("Copier le lien", "Copy link")}
              </button>
            </div>
          </div>
          <p role="status">{exportError}</p>
          <div
            className="table-wrap"
            tabIndex={0}
            role="region"
            aria-label={t("Résultats de l’exploration", "Explorer results")}
          >
            <table>
              <caption>
                {t("Aperçu des données — tiret : valeur absente", "Data preview — dash: missing value")}
              </caption>
              <thead>
                <tr>
                  {[...(!arraySource ? ["_key"] : []), ...tableColumns].map((k) => (
                    <th
                      key={k}
                      aria-sort={sort.key === k ? (sort.direction === 1 ? "ascending" : "descending") : "none"}
                    >
                      <button onClick={() => setSort({ key: k, direction: sort.key === k ? -sort.direction : 1 })}>
                        {k === "_key"
                          ? t("Identifiant / territoire", "Identifier / territory")
                          : temporal
                          ? label(k, lang) + (d.collection === "mix" && k !== "period" ? " (%)" : "")
                          : shortLabel(k, lang)}{" "}
                        {sort.key === k ? (sort.direction === 1 ? "↑" : "↓") : "↕"}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.slice(page * 25, (page + 1) * 25).map((r) => (
                  <tr key={`${r.key}-${r.period}`} className={hasDetailPanel ? "hardware-row" : undefined}
                    onClick={hasDetailPanel ? (event) => {
                      if (!(event.target as Element).closest("button, a, input, select")) {
                        event.currentTarget.querySelector<HTMLButtonElement>(".detail-link")?.focus();
                        setDetailRow(r);
                      }
                    } : undefined}>
                    {!arraySource && <th scope="row">{hasDetailPanel
                      ? <button className="detail-link" aria-haspopup="dialog" onClick={() => setDetailRow(r)}>{names[r.key] || termLabel(r.key, lang)}</button>
                      : names[r.key] || termLabel(r.key, lang)}</th>}
                    {tableColumns.map((k) => (
                      <td key={k}>
                        {hasDetailPanel && k === (d.collection === "ai" || d.id.endsWith("vms") ? "name" : "id") ? (
                          <button className="detail-link" onClick={() => setDetailRow(r)} aria-haspopup="dialog">{format(r.values[k], lang)}</button>
                        ) : k === "sources" && Array.isArray(r.values[k]) ? (
                          <ul>
                            {r.values[k]
                              .filter((url: string) => /^https?:\/\//.test(url))
                              .map((url: string, i: number) => (
                                <li key={url}>
                                  <a href={url}>
                                    {t("Source", "Source")} {i + 1} ↗
                                  </a>
                                </li>
                              ))}
                          </ul>
                        ) : d.collection === "mix" ? k === "period" ? r.period : mixPercent(r.values[k], lang) : (
                          format(
                            ["input", "output", "type", "architecture", "category"].includes(k)
                              ? Array.isArray(r.values[k]) ? r.values[k].map((v: string) => termLabel(v, lang)) : termLabel(r.values[k], lang)
                              : k === "country" && typeof r.values[k] === "string" ? regionLabel(r.values[k].toUpperCase(), r.values[k], lang)
                              : k === "estimated" && Array.isArray(r.values[k]) ? r.values[k].map((v: string) => label(v, lang))
                              : tableValue(r, k), lang)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filtered.length && <p>{t("Aucun résultat pour ces filtres.", "No results match these filters.")}</p>}
          {filtered.length > 25 && (
            <div className="pagination">
              <button disabled={!page} onClick={() => setPage(page - 1)}>
                {t("Précédent", "Previous")}
              </button>
              <span>
                {page + 1} / {Math.ceil(filtered.length / 25)}
              </span>
              <button disabled={(page + 1) * 25 >= filtered.length} onClick={() => setPage(page + 1)}>
                {t("Suivant", "Next")}
              </button>
            </div>
          )}
        </>
      )}
      {detailRow && <DetailPanel row={detailRow} lang={lang} onClose={() => setDetailRow(null)} />}
    </section>
  );
}
function DetailValue({ field, value, lang }: { field: string; value: unknown; lang: string }): React.ReactElement {
  if (Array.isArray(value)) {
    if (!value.length) return <>{"—"}</>;
    if (field === "sources") return <ul className="detail-values">{value.map((entry, i) =>
      <li key={i}><DetailValue field={field} value={entry} lang={lang} /></li>)}</ul>;
    return <>{value.map((entry, i) => <React.Fragment key={i}>{i > 0 ? " · " : ""}
      <DetailValue field={field} value={entry} lang={lang} /></React.Fragment>)}</>;
  }
  if (value && typeof value === "object") return <ul className="detail-values">{Object.entries(value).map(([key, entry]) =>
    <li key={key}><strong>{label(key, lang)}</strong> : <DetailValue field={key} value={entry} lang={lang} /></li>)}</ul>;
  if (typeof value === "string" && /^https?:\/\//.test(value)) return <a href={value}>{value}</a>;
  const translated = typeof value === "string"
    ? field === "estimated" ? label(value, lang)
      : ["input", "output", "type", "category", "architecture"].includes(field) ? termLabel(value, lang) : value
    : value;
  return <>{format(translated, lang)}</>;
}
function DetailPanel({ row, lang, onClose }: { row: Row; lang: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const heading = useId();
  const title = termLabel(String(row.values.name || row.values.id || row.key), lang);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <dialog ref={ref} className="hardware-panel" aria-labelledby={heading} onClose={onClose}
    onClick={(event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.target === event.currentTarget && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) event.currentTarget.close();
    }}>
    <header className="hardware-panel-header">
      <div><p className="eyebrow">{text("CARACTÉRISTIQUES", "SPECIFICATIONS", lang)}</p><h2 id={heading}>{title}</h2></div>
      <button autoFocus onClick={() => ref.current?.close()} aria-label={text("Fermer le panneau", "Close panel", lang)}>×</button>
    </header>
    <table className="hardware-properties" aria-labelledby={heading}><tbody>
      {Object.entries(row.values).flatMap(([key, value]) => key === "parameters" && value && typeof value === "object"
        ? Object.entries(value).map(([part, amount]) => [`parameters.${part}`, amount] as const)
        : [[key, value] as const]).map(([key, value]) => <tr key={key}>
        <th scope="row">{label(key, lang)}</th>
        <td><DetailValue field={key} value={value} lang={lang} /></td>
      </tr>)}
    </tbody></table>
  </dialog>;
}
function FactorMap({
  paths,
  rows,
  metric,
  lang,
  names,
  period,
  selected,
  onSelect,
  countryLevel,
}: {
  countryLevel: boolean;
  selected: string;
  onSelect: (key: string) => void;
  paths: Record<string, string>;
  rows: Row[];
  metric: string;
  lang: string;
  names: Record<string, string>;
  period: string;
}) {
  const tip = useTooltip(useMemo(() => ({ rows, metric }), [rows, metric]));
  const zoom = useMapZoom(lang, tip.close);
  const [suppressed, setSuppressed] = useState("");
  const values = Object.fromEntries(rows.map((r) => [r.key, r.values[metric]]));
  const numbers = Object.values(values).filter((v) => typeof v === "number" && Number.isFinite(v));
  const max = Math.max(0, ...numbers);
  return (
    <figure className="map" onPointerLeave={tip.close}>
      <div className="map-viewport">
      {zoom.controls}
      <svg
        viewBox={zoom.viewBox}
        role="group"
        aria-label={text("Carte des facteurs d’impact", "Impact factor map", lang)}
        onClick={(event) => {
          if (event.target === event.currentTarget) { onSelect(""); tip.close(); }
        }}
      >
        <g className="map-layer" style={{ transform: zoom.transform }}>
        {Object.entries(displayPaths(paths, countryLevel)).map(([key, path]) => {
          const targetKey = countryLevel ? key.slice(0, 2) : key;
          const value = values[targetKey];
          const message = `${names[key] || names[key.slice(0, 2)] || key} (${key})\n${period} · ${label(
            metric,
            lang
          )} / kWh\n${format(value, lang)}`;
          return (
            <path
              key={key}
              d={path}
              fill={impactColor(value, max)}
              stroke="white"
              strokeWidth={0.4}
              aria-pressed={selected === targetKey}
              data-hover-suppressed={suppressed === targetKey ? "true" : undefined}
              {...tip.bind(message)}
              onPointerEnter={(event) => { setSuppressed(""); tip.bind(message).onPointerEnter(event); }}
              onPointerLeave={() => { setSuppressed(""); tip.close(); }}
              onClick={(event) => {
                tip.bind(message).onClick(event);
                setSuppressed(selected === targetKey ? targetKey : "");
                onSelect(selected === targetKey ? "" : targetKey);
              }}
              onKeyDown={(e) => {
                tip.bind(message).onKeyDown(e);
                if (e.key === "Enter" || e.key === " ") onSelect(selected === targetKey ? "" : targetKey);
              }}
            />
          );
        })}
      </g>
      </svg>
      </div>
      {tip.tooltip}
      <figcaption>
        {label(metric, lang)} / kWh · {text("Impact faible", "Low impact", lang)} (0){" "}
        <span className="gradient" style={{ background: `linear-gradient(to right, ${impactColors.join(", ")})` }} />{" "}
        {text("Impact élevé", "High impact", lang)} ({format(max, lang)}) ·{" "}
        {text(
          "Gris : donnée absente. Survolez, touchez ou sélectionnez un territoire au clavier.",
          "Gray: no data. Hover, tap or focus a territory.",
          lang
        )}
      </figcaption>
    </figure>
  );
}
function Trend({ rows, metric, lang, unit }: { rows: Row[]; metric: string; lang: string; unit: string }) {
  const tip = useTooltip(rows);
  const values = rows.map((r) => r.values[metric]);
  const max = Math.max(0, ...values.filter((v) => typeof v === "number"));
  let points = "";
  const segments: string[] = [];
  const x = (i: number) => 20 + (i * 560) / Math.max(1, values.length - 1);
  const y = (v: number) => 130 - (max ? v / max : 0) * 110;
  values.forEach((v, i) => {
    if (typeof v === "number") {
      points += `${x(i)},${y(v)} `;
    } else {
      if (points) segments.push(points);
      points = "";
    }
  });
  if (points) segments.push(points);
  return (
    <figure className="trend" onPointerLeave={tip.close}>
      <svg viewBox="0 0 600 160" role="group" aria-label={text("Évolution temporelle", "Time evolution", lang)}>
        <line x1="20" x2="580" y1="130" y2="130" stroke="#ddd" />
        {segments.map((s, i) => (
          <polyline key={i} points={s} fill="none" stroke="#003878" strokeWidth="3" />
        ))}
        {values.map((v, i) =>
          typeof v === "number" ? (
            <circle
              key={i}
              cx={x(i)}
              cy={y(v)}
              r="4"
              fill="#f15842"
              stroke="white"
              {...tip.bind(`${rows[i].period}\n${format(v, lang)} · ${unit}`)}
            />
          ) : null
        )}
        <text x="20" y="153">
          {rows[0]?.period}
        </text>
        <text x="580" y="153" textAnchor="end">
          {rows[rows.length - 1]?.period}
        </text>
      </svg>
      {tip.tooltip}
    </figure>
  );
}
