import React, { useState } from "react";

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
  const [area, setArea] = useState(0);
  const [, , scale, x, y] = views[area];
  return { viewBox: "0 130 800 400", scale, transform: `translate(${x}px, ${y}px) scale(${scale})`, controls: <div className="map-controls">
    <select aria-label={lang === "fr" ? "Vue" : "View"} value={area} onChange={e => {
      closeTooltip();
      setArea(Number(e.target.value));
    }}>{views.map((v, i) => <option key={i} value={i}>{v[lang === "fr" ? 0 : 1]}</option>)}</select>
  </div> };
}
