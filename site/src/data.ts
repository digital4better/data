export type Row = { key: string; period?: string; datasetId?: string; sourceKey?: string; values: Record<string, any> };
export function rowsOf(data: any, temporal: boolean, world: boolean): Row[] {
  if (Array.isArray(data)) return data.map((values, i) => ({ key: String(i), values }));
  if (!temporal) return Object.entries(data).map(([key, values]) => ({ key, values: values as Record<string, any> }));
  if (world)
    return Object.entries(data).map(([period, values]) => ({
      key: "world",
      period,
      values: values as Record<string, any>,
    }));
  return Object.entries(data).flatMap(([key, periods]) =>
    Object.entries(periods as object).map(([period, values]) => ({ key, period, values }))
  );
}
export function subsetOf(source: any, rows: Row[], temporal: boolean, world: boolean) {
  if (Array.isArray(source)) return rows.map((r) => r.values);
  if (!temporal) return Object.fromEntries(rows.map((r) => [r.key, r.values]));
  if (world) return Object.fromEntries(rows.map((r) => [r.period, r.values]));
  const result: Record<string, any> = {};
  rows.forEach((r) => {
    (result[r.key] ??= {})[r.period!] = r.values;
  });
  return result;
}
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') {
        value += '"';
        i++;
      } else quoted = !quoted;
    } else if (c === "," && !quoted) {
      row.push(value);
      value = "";
    } else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(value);
      if (row.some((x) => x !== "")) rows.push(row);
      row = [];
      value = "";
    } else value += c;
  }
  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }
  return rows;
}
export function csvSubset(csv: string, source: any, selected: Row[], temporal: boolean, world: boolean) {
  const [headers, ...records] = parseCsv(csv);
  const indices = new Set(selected.map((r) => r.key));
  const keys = new Set(selected.map((r) => `${r.key}\0${r.period}`));
  const identityIndex = headers.findIndex((h) =>
    Array.isArray(source) ? ["id", "name"].includes(h) : ["equipment", "energy"].includes(h)
  );
  const identities = new Set(
    selected.map((r) => (Array.isArray(source) ? String(r.values[headers[identityIndex]]) : r.key))
  );
  const sourceKeys = Array.isArray(source) ? [] : Object.keys(source);
  const periodIndex = headers.findIndex((h) => h === "year" || h === "period");
  const geoIndex = headers.findIndex((h) => ["country", "subdivision", "continent"].includes(h));
  const filtered = records.filter((record, i) =>
    temporal
      ? keys.has(`${world ? "world" : record[geoIndex]}\0${record[periodIndex]}`)
      : identityIndex >= 0
      ? identities.has(record[identityIndex])
      : indices.has(Array.isArray(source) ? String(i) : sourceKeys[i])
  );
  return (
    [headers, ...filtered].map((row) => row.map((v) => '"' + v.replace(/"/g, '""') + '"').join(",")).join("\r\n") +
    "\r\n"
  );
}

// Source metadata stays outside values so exports never gain synthetic fields.
export function cloudRows(sources: Record<string, any>): Row[] {
  return Object.entries(sources).flatMap(([datasetId, source]) => rowsOf(source, false, false).map((row) => ({
    ...row, key: `${datasetId}:${row.key}`, sourceKey: row.key, datasetId,
  })));
}
export function cloudExportRows(rows: Row[], datasetId: string): Row[] {
  return rows.filter((row) => row.datasetId === datasetId).map((row) => ({ key: row.sourceKey!, values: row.values }));
}
