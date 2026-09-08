import React, { useId, useState } from "react";

// Same continent framing as the Fruggr infrastructure map.
const views = [
  ["Monde", "World", 1, 0, 0],
  ["Afrique", "Africa", 2.2, -570, -470],
  ["Amérique du Nord", "North America", 2.22, 0, -260],
  ["Amérique du Sud", "South America", 2.1, -160, -570],
  ["Asie", "Asia", 2.3, -950, -380],
  ["Europe", "Europe", 3.2, -940, -395],
  ["Océanie", "Oceania", 3.2, -1860, -1050],
] as const;
export function useMapZoom(lang: string, closeTooltip: () => void) {
  const id = useId();
  const [area, setArea] = useState(0);
  const [view, setView] = useState([0, 130, 800, 400]);
  const scale = 800 / view[2];
  const change = (next: number[]) => { closeTooltip(); setView(next); };
  const zoom = (factor: number) => {
    const width = Math.min(800, Math.max(100, view[2] / factor));
    change([Math.max(0, Math.min(800 - width, view[0] + (view[2] - width) / 2)),
      Math.max(130, Math.min(530 - width / 2, view[1] + (view[3] - width / 2) / 2)), width, width / 2]);
  };
  const reset = () => { setArea(0); change([0, 130, 800, 400]); };
  return { viewBox: view.join(" "), scale, controls: <div className="map-controls">
    <label htmlFor={id}>{lang === "fr" ? "Vue" : "View"}</label>
    <select id={id} value={area} onChange={e => {
      const index = Number(e.target.value); setArea(index);
      const [, , s, x, y] = views[index]; change([-x / s, (130 - y) / s, 800 / s, 400 / s]);
    }}>{views.map((v, i) => <option key={i} value={i}>{v[lang === "fr" ? 0 : 1]}</option>)}</select>
    <button type="button" onClick={() => zoom(1.5)} disabled={scale >= 8} aria-label={lang === "fr" ? "Zoomer" : "Zoom in"}>+</button>
    <button type="button" onClick={() => zoom(1 / 1.5)} disabled={scale <= 1} aria-label={lang === "fr" ? "Dézoomer" : "Zoom out"}>−</button>
    <button type="button" onClick={reset}>{lang === "fr" ? "Vue mondiale" : "World view"}</button>
  </div> };
}
