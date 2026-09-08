import { useMapZoom } from "./map-zoom";
import { tooltipPosition } from "./tooltip-position";
import { termLabel, regionLabel } from "./localization";
import React, { useEffect, useId, useState, useRef, useLayoutEffect } from "react";
import type { Row } from "./data";
import { countsBy, numericBars, groupedLocations, displayPaths } from "./chart-data";
const t = (lang: string, fr: string, en: string) => (lang === "fr" ? fr : en);
const number = (v: unknown, lang: string) =>
  typeof v === "number" && Number.isFinite(v)
    ? new Intl.NumberFormat(lang, { maximumSignificantDigits: 6 }).format(v)
    : "—";
type TooltipData = { text: string; content?: React.ReactNode; x: number; y: number };
function Tooltip({ id, tip }: { id: string; tip: TooltipData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: tip.x, top: tip.y });
  useLayoutEffect(() => {
    const rect = ref.current!.getBoundingClientRect();
    setPosition(tooltipPosition(tip.x, tip.y, rect.width, rect.height, window.innerWidth, window.innerHeight));
  }, [tip]);
  return <div ref={ref} id={id} role="tooltip" className="chart-tooltip" style={position}>{tip.content || tip.text}</div>;
}
export function useTooltip(resetKey?: unknown) {
  const id = useId();
  const [tip, setTip] = useState<TooltipData | null>(null);
  useEffect(() => setTip(null), [resetKey]);
  useEffect(() => {
    const dismiss = (event: Event) => {
      if (event.type === "keydown" && (event as KeyboardEvent).key !== "Escape") return;
      if (event.target instanceof Element && event.target.closest(".chart-tooltip")) return;
      setTip(null);
    };
    window.addEventListener("keydown", dismiss);
    window.addEventListener("resize", dismiss);
    window.addEventListener("scroll", dismiss, true);
    return () => {
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("resize", dismiss);
      window.removeEventListener("scroll", dismiss, true);
    };
  }, []);
  function show(target: Element, text: string, content?: React.ReactNode, pointer?: { clientX: number; clientY: number }) {
    const rect = target.getBoundingClientRect();
    setTip((current) => pointer && current?.text === text ? current : ({
      text,
      content,
      x: pointer ? pointer.clientX : rect.left + rect.width / 2,
      y: pointer ? pointer.clientY : rect.bottom,
    }));
  }
  return {
    bind: (message: string, content?: React.ReactNode) => ({
      tabIndex: 0,
      role: "button" as const,
      "aria-label": message,
      "aria-describedby": tip?.text === message ? id : undefined,
      onPointerEnter: (e: React.PointerEvent<Element>) => show(e.currentTarget, message, content, e),
      onPointerLeave: () => setTip(null),
      onFocus: (e: React.FocusEvent<Element>) => {
        const target = e.currentTarget;
        requestAnimationFrame(() => {
          if (document.activeElement === target && target.matches(":focus-visible")) show(target, message, content);
        });
      },
      onBlur: () => setTip(null),
      onClick: (e: React.MouseEvent<Element>) => show(e.currentTarget, message, content, e.detail ? e : undefined),
      onKeyDown: (e: React.KeyboardEvent<Element>) => {
        if (e.key === "Escape") setTip(null);
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          show(e.currentTarget, message, content);
        }
      },
    }),
    close: () => setTip(null),
    tooltip: tip ? <Tooltip id={id} tip={tip} /> : null,
  };
}
export function Bars({
  title,
  items,
  lang,
  unit = "",
  note,
  initialLimit,
}: {
  initialLimit?: number;
  title: string;
  items: { name: string; value: number; unit?: string }[];
  lang: string;
  unit?: string;
  note?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const data = items.filter((item) => Number.isFinite(item.value));
  const max = Math.max(0, ...data.map((x) => Math.abs(x.value)));
  return (
    <figure className="data-chart">
      <figcaption>
        <h3>{title}</h3>
        {note && <p className="muted">{note}</p>}
      </figcaption>
      {data.length ? (
        <div className="bars-list">
          {(initialLimit && !expanded ? data.slice(0, initialLimit) : data).map((item, i) => (
            <div className="chart-bar" key={`${item.name}-${i}`}>
              <span className="bar-name">{item.name}</span>
              <span className="bar-track">
                <span
                  style={{
                    width: `${max ? (Math.abs(item.value) / max) * 100 : 0}%`,
                    background: item.value < 0 ? "#b44838" : undefined,
                  }}
                />
              </span>
              <strong>
                {number(item.value, lang)} {item.unit || unit}
              </strong>
            </div>
          ))}
        </div>
      ) : (
        <p>{t(lang, "Aucune valeur numérique disponible.", "No numeric values available.")}</p>
      )}
      {initialLimit && data.length > initialLimit && (
        <button onClick={() => setExpanded(!expanded)}>
          {expanded
            ? t(lang, "Réduire à ", "Show top ") + initialLimit
            : t(lang, "Afficher les ", "Show all ") + data.length + t(lang, " valeurs", " values")}
        </button>
      )}
    </figure>
  );
}
export function CloudMap({ rows, lang }: { rows: Row[]; lang: string }) {
  const [paths, setPaths] = useState<Record<string, string>>({});
  const [failed, setFailed] = useState(false);
  const tip = useTooltip(rows);
  const zoom = useMapZoom(lang, tip.close);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/data/country/regions-paths.json", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setPaths)
      .catch((e) => {
        if (e.name !== "AbortError") setFailed(true);
      });
    return () => controller.abort();
  }, []);
  const points = groupedLocations(rows);
  const missing = rows.length - points.reduce((sum, p) => sum + p.rows.length, 0);
  return (
    <figure className="data-chart cloud-map" onPointerLeave={tip.close}>
      <figcaption>
        <h3>{t(lang, "Régions cloud dans le monde", "Cloud regions around the world")}</h3>
        <p className="muted">
          {t(
            lang,
            "Survolez, touchez ou sélectionnez un point au clavier pour consulter les régions.",
            "Hover, tap or focus a point to inspect its regions."
          )}
        </p>
      </figcaption>
      {zoom.controls}
      <svg viewBox={zoom.viewBox} role="group" aria-label={t(lang, "Carte des régions cloud", "Cloud region map")}>

        {Object.entries(displayPaths(paths, true)).map(([i, path]) => (
          <path key={i} d={path} fill="#dce5ef" stroke="#fff" strokeWidth=".6" />
        ))}
        {points.map(({ point, rows: group }, i) => {
          const description = group
            .map(
              ({ values: v }) =>
                `${v.id} · ${v.location || v.name}\n${String(v.provider || "").toUpperCase()} · ${regionLabel(String(v.country || "").toUpperCase(), String(v.country || ""), lang)}\nPUE ${number(v.pue, lang)} · WUE ${number(v.wue, lang)} · REF ${number(v.ref, lang)}`
            )
            .join("\n\n");
          return (
            <g key={i} {...tip.bind(description)} className="map-marker">
              <circle cx={point[0]} cy={point[1]} r={10 / zoom.scale} fill="transparent" />
              <circle
                cx={point[0]}
                cy={point[1]}
                r={(group.length > 1 ? 6 : 4.5) / zoom.scale}
                fill="#f15842"
                stroke="white"
                strokeWidth="1.5"
              />
              {group.length > 1 && (
                <text x={point[0]} y={point[1] + 2 / zoom.scale} textAnchor="middle" fill="white" fontSize={6 / zoom.scale} aria-hidden="true">
                  {group.length}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {tip.tooltip}
      <p className="muted">
        {points.reduce((s, p) => s + p.rows.length, 0)}{" "}
        {t(
          lang,
          "régions localisées. Les régions de mêmes coordonnées sont regroupées.",
          "located regions. Regions sharing coordinates are grouped."
        )}{" "}
        {missing > 0 ? `${missing} ${t(lang, "sans coordonnées valides.", "without valid coordinates.")}` : ""}{" "}
        {failed
          ? t(
              lang,
              "Fond de carte indisponible ; coordonnées et tableau conservés.",
              "Basemap unavailable; coordinates and table retained."
            )
          : ""}
      </p>
      <p className="muted">
        {t(
          lang,
          "PUE : ratio · WUE : unité et périmètre de la source · REF : fraction. Les zéros peuvent être des conventions ; voir les sources.",
          "PUE: ratio · WUE: source unit and boundary · REF: fraction. Zeros may be conventions; see sources."
        )}{" "}
        <a href="https://github.com/digital4better/data/blob/main/data/country/regions-paths.json">{t(lang, "Fond de carte commun", "Shared map background")}</a>
      </p>
    </figure>
  );
}
export function CatalogCharts({
  rows,
  collection,
  metric,
  metricLabel,
  lang,
}: {
  rows: Row[];
  collection: string;
  metric: string;
  metricLabel: string;
  lang: string;
}) {
  if (collection === "ai")
    return (
      <div className="chart-grid">
        <Bars
          title={t(lang, "Modèles par éditeur", "Models by vendor")}
          items={countsBy(rows, "vendor")}
          lang={lang}
          unit={t(lang, "modèles", "models")}
        />
        <Bars
          title={t(lang, "Capacités répertoriées", "Recorded capabilities")}
          items={["reasoning", "tools", "open"].map((key, i) => ({
            name: [
              t(lang, "Raisonnement", "Reasoning"),
              t(lang, "Outils", "Tools"),
              t(lang, "Indicateur d’ouverture", "Open flag"),
            ][i],
            value: rows.filter((r) => r.values[key] === true).length,
          }))}
          unit={t(lang, "modèles", "models")}
          lang={lang}
          note={t(
            lang,
            "Comptages sur les modèles filtrés, pour les capacités explicitement renseignées à true. Les catégories se recoupent ; les valeurs absentes ne signifient pas non. « Open » ne remplace pas la lecture de la licence.",
            "Counts use filtered models and capabilities explicitly recorded as true. Categories overlap; missing values do not mean false. “Open” does not replace reading the license."
          )}
        />
      </div>
    );
  const bars = numericBars(rows, metric);
  const units = [...new Set(bars.map((b) => b.unit))];
  return (
    <div>
      {units.map((unit) => {
        const entries = bars.filter((b) => b.unit === unit);
        return (
          <Bars
            key={unit}
            title={`${metricLabel}${unit ? " · " + unit : ""}`}
            items={entries.map((b) => ({ ...b, name: termLabel(b.name, lang), unit: "" }))}
            initialLimit={20}
            lang={lang}
            note={`${
              entries.length > 20
                ? t(lang, "Par défaut : 20 valeurs les plus élevées sur ", "Default: 20 highest values out of ") +
                  entries.length +
                  ". "
                : ""
            }${unit ? t(lang, "Unité commune : ", "Shared unit: ") + unit + ". " : ""}${t(
              lang,
              "Comparaison des valeurs de référence filtrées. Les unités et hypothèses sont détaillées dans les sources.",
              "Comparison of filtered reference values. Units and assumptions are detailed in the sources."
            )}`}
          />
        );
      })}
    </div>
  );
}

const energyColors: Record<string, string> = {
  Bioenergy: "#7a9957",
  Coal: "#505763",
  Gas: "#bc855a",
  Hydro: "#498bae",
  Nuclear: "#9865ab",
  "Other Fossil": "#8d776b",
  "Other Renewables": "#6c9b89",
  Solar: "#dbb145",
  Wind: "#77b3b0",
};
export function MixComposition({ values, lang }: { values: Record<string, any>; lang: string }) {
  const entries = Object.entries(values).filter(([, v]) => typeof v === "number" && Number.isFinite(v));
  return (
    <>
      <div className="mix-stack" aria-hidden="true">
        {entries.map(([key, value]) => (
          <span
            key={key}
            style={{ width: `${Math.max(0, value) * 100}%`, background: energyColors[key] || "#64748b" }}
          />
        ))}
      </div>
      <div className="mix-values">
        {entries.map(([key, value]) => (
          <div key={key}>
            <span>
              <i style={{ background: energyColors[key] || "#64748b" }} />
              {termLabel(key, lang)}
            </span>
            <strong>{number(value * 100, lang)} %</strong>
          </div>
        ))}
      </div>
    </>
  );
}
export function MixMap({
  paths,
  rows,
  period,
  names,
  lang,
  selected,
  onSelect,
  countryLevel,
  green,
}: {
  paths: Record<string, string>;
  rows: Row[];
  period: string;
  names: Record<string, string>;
  lang: string;
  selected?: string;
  onSelect: (key: string) => void;
  countryLevel: boolean;
  green: boolean;
}) {
  const tip = useTooltip(rows);
  const zoom = useMapZoom(lang, tip.close);
  const [suppressed, setSuppressed] = useState("");
  const byKey = new Map(rows.map((row) => [row.key, row]));
  return (
    <figure className="map mix-map" onPointerLeave={tip.close}>
      <figcaption>
        <h3>{t(lang, "Choisir un territoire", "Choose a territory")}</h3>
        <p>
          {t(
            lang,
            "Survolez un territoire pour voir son mix complet. Cliquez pour sélectionner son détail et son évolution.",
            "Hover over a territory for its full mix. Click to select its detail and history."
          )}
        </p>
        {green && (
          <p className="notice">
            {t(lang, "Scénario green : mix renouvelable renormalisé.", "Green scenario: renormalized renewable mix.")}
          </p>
        )}
      </figcaption>
      {zoom.controls}
      <svg viewBox={zoom.viewBox} role="group" aria-label={t(lang, "Carte du mix électrique", "Electricity mix map")}
        onClick={(event) => {
          if (event.target === event.currentTarget) { onSelect(""); tip.close(); }
        }}>
        {Object.entries(displayPaths(paths, countryLevel)).map(([pathKey, path]) => {
          const key = countryLevel ? pathKey.slice(0, 2) : pathKey;
          const row = byKey.get(key);
          const name = names[key] || key;
          const content = (
            <>
              <strong>
                {name} · {period}
              </strong>
              {row ? (
                <MixComposition values={row.values} lang={lang} />
              ) : (
                <p>{t(lang, "Aucune donnée pour cette période.", "No data for this period.")}</p>
              )}
            </>
          );
          const message = `${name} (${key}) · ${period} · ${
            row
              ? Object.entries(row.values).map(([energy, value]) => `${termLabel(energy, lang)} : ${typeof value === "number" ? number(value * 100, lang) + " %" : t(lang, "donnée absente", "no data")}`).join(" · ")
              : t(lang, "donnée absente", "no data")
          }`;
          const bindings = tip.bind(message, content);
          return (
            <path
              key={pathKey}
              d={path}
              fill="#dce5ef"
              stroke="white"
              strokeWidth={0.4}
              aria-pressed={selected === key}
              data-hover-suppressed={suppressed === key ? "true" : undefined}
              {...bindings}
              onPointerEnter={(event) => { setSuppressed(""); bindings.onPointerEnter(event); }}
              onPointerLeave={() => { setSuppressed(""); tip.close(); }}
              onClick={(e) => {
                bindings.onClick(e);
                setSuppressed(selected === key ? key : "");
                onSelect(selected === key ? "" : key);
              }}
              onKeyDown={(e) => {
                bindings.onKeyDown(e);
                if (e.key === "Enter" || e.key === " ") onSelect(selected === key ? "" : key);
              }}
            />
          );
        })}
      </svg>
      {tip.tooltip}
    </figure>
  );
}
