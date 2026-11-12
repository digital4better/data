import { readFileSync, writeFileSync } from "node:fs";

type Values = Record<string, number | null>;
type Series = Record<string, Values>;
type Dataset = Record<string, Series>;

export type LegacyElectricitySnapshot = {
  source: {
    version: string;
    commit: string;
    releaseDate: string;
    upstreamObservationDate: null;
    description: string;
  };
  territories: Record<string, string>;
  datasets: Record<string, Dataset>;
};

const nextPeriod = (period: string, monthly: boolean): string => {
  if (!monthly) return String(Number(period) + 1);
  const date = new Date(`${period}-01T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + 1);
  return date.toISOString().slice(0, 7);
};

// Retain national reference values after aggregation: raw historical energy
// volumes are unavailable, so they must not be invented for world weighting.
export const restoreLegacyElectricity = (
  availableTerritories: string[],
  snapshot: LegacyElectricitySnapshot,
  exportCsv: (file: string, rows: Record<string, string | number | null>[]) => void
) => {
  const available = new Set(availableTerritories);
  const preserved = Object.keys(snapshot.territories).filter((code) => !available.has(code)).sort();
  const datasets: Record<string, { through: string; lastPublishedPeriod: Record<string, string> }> = {};

  if (preserved.length) {
    for (const collection of ["factor", "mix"])
      for (const frequency of ["yearly", "monthly"])
        for (const suffix of ["", "-green"]) {
          const id = `${collection}/country-${frequency}${suffix}`;
          const file = `data/${id}`;
          const current: Dataset = JSON.parse(readFileSync(`${file}.json`, "utf8"));
          const periods = Object.values(current).flatMap((series) => Object.keys(series)).sort();
          const through = periods[periods.length - 1];
          if (!through) throw new Error(`Cannot restore historical references into an empty dataset: ${id}`);
          const monthly = frequency === "monthly";
          const lastPublishedPeriod: Record<string, string> = {};
          for (const code of preserved) {
            const original = snapshot.datasets[id]?.[code];
            if (!original) throw new Error(`Historical electricity snapshot is missing ${id} / ${code}`);
            const entries = Object.entries(original).filter(([period]) => period <= through).sort(([a], [b]) => a.localeCompare(b));
            const last = entries[entries.length - 1];
            if (!last) throw new Error(`No historical reference before ${through}: ${id} / ${code}`);
            const series: Series = Object.fromEntries(entries.map(([period, values]) => [period, { ...values }]));
            lastPublishedPeriod[code] = last[0];
            for (let period = nextPeriod(last[0], monthly); period <= through; period = nextPeriod(period, monthly))
              series[period] = { ...last[1] };
            current[code] = series;
          }
          const ordered: Dataset = Object.fromEntries(Object.entries(current).sort(([a], [b]) => a.localeCompare(b)));
          const records = Object.entries(ordered).flatMap(([country, series]) =>
            Object.entries(series).sort(([a], [b]) => a.localeCompare(b)).map(([period, values]) => ({
              country,
              [monthly ? "period" : "year"]: period,
              ...values,
            }))
          );
          writeFileSync(`${file}.json`, JSON.stringify(ordered, null, 2));
          exportCsv(`${file}.csv`, records);
          datasets[id] = { through, lastPublishedPeriod };
        }
  }

  const provenance = {
    schemaVersion: 1,
    method: "preserve-last-published-series",
    description: "Territories absent from current Ember exports retain published historical values. Later periods carry the last reference forward; they are not new observations. Current Ember data takes precedence when a territory returns.",
    sourceSnapshot: snapshot.source,
    territories: Object.fromEntries(preserved.map((code) => [code, {
      name: snapshot.territories[code],
      status: "historical-reference",
      reason: "absent-from-current-ember-export",
      upstreamObservationDate: null as null,
    }])),
    datasets,
  };
  writeFileSync("scripts/electricity-provenance.json", JSON.stringify(provenance, null, 2));
  return provenance;
};
