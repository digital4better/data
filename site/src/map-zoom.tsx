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
  return { viewBox: view.join(" "), scale, controls: <div className="map-controls">
    <label htmlFor={id}>{lang === "fr" ? "Vue" : "View"}</label>
    <select id={id} value={area} onChange={e => {
      const index = Number(e.target.value); setArea(index);
      const [, , s, x, y] = views[index]; change([-x / s, (130 - y) / s, 800 / s, 400 / s]);
    }}>{views.map((v, i) => <option key={i} value={i}>{v[lang === "fr" ? 0 : 1]}</option>)}</select>
  </div> };
}
