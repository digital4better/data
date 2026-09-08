import type { Row } from "./data";
export function projectLocation(lon: unknown, lat: unknown): [number, number] | null {
  if (
    typeof lon !== "number" ||
    typeof lat !== "number" ||
    !Number.isFinite(lon) ||
    !Number.isFinite(lat) ||
    Math.abs(lon) > 180 ||
    Math.abs(lat) > 90
  )
    return null;
  return [((lon + 180) / 360) * 800, ((90 - lat) / 180) * 400];
}
export function countsBy(rows: Row[], key: string) {
  const counts = new Map<string, number>();
  rows.forEach((r) => {
    const v = r.values[key];
    if (v == null) return;
    for (const item of new Set(Array.isArray(v) ? v : [v]))
      counts.set(String(item), (counts.get(String(item)) || 0) + 1);
  });
  return [...counts]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
}
export function numericBars(rows: Row[], key: string) {
  return rows
    .filter((r) => typeof r.values[key] === "number" && Number.isFinite(r.values[key]))
    .map((r) => ({
      name: String(r.values.name || r.values.id || r.values.description || r.key),
      value: r.values[key] as number,
      unit: String(r.values.unit || ""),
    }))
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
}
export function groupedLocations(rows: Row[]) {
  const points = new Map<string, { point: [number, number]; rows: Row[] }>();
  rows.forEach((r) => {
    const point = projectLocation(r.values.lon, r.values.lat);
    if (!point) return;
    const key = point.join(",");
    const entry = points.get(key) || { point, rows: [] };
    entry.rows.push(r);
    points.set(key, entry);
  });
  return [...points.values()];
}

export function selectedTerritory(region: string, world: boolean) {
  return world ? "world" : region || undefined;
}
export function rowsAtPeriod(rows: Row[], period: string) {
  return rows.filter((r) => r.period === period);
}
export function allowedFilters(collection: string, dataset: string) {
  return collection === "ai"
    ? ["vendor", "input", "output", "open", "reasoning", "tools", "context"]
    : collection === "cloud" && dataset.endsWith("regions")
    ? ["country"]
    : [];
}
export function resolvePeriod(requested: string, periods: string[]) {
  if (periods.includes(requested)) return requested;
  const sameYear = periods.filter((p) => p.slice(0, 4) === requested.slice(0, 4)).sort();
  return sameYear.at(-1) || periods[0] || "";
}
export function displayPaths(paths: Record<string, string>, countryLevel: boolean) {
  if (!countryLevel) return paths;
  const merged: Record<string, string> = {};
  for (const [key, path] of Object.entries(paths)) {
    const country = key.slice(0, 2);
    merged[country] = (merged[country] || "") + " " + path;
  }
  return merged;
}
