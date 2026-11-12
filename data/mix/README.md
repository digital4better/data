# Electricity Mixes

Modeled electricity technology shares by geography and period, with full-mix and renewable-only scenarios. Use [electricity factors](../factor/README.md) to convert electricity consumption into environmental impacts.

## Files

Files follow `<geography>-<frequency>[-green].json`, each with a matching CSV. Every geography below has yearly/monthly and full/green variants.

| Geography | Yearly full mix | Monthly full mix |
| --- | --- | --- |
| Country | [JSON](./country-yearly.json) / [CSV](./country-yearly.csv) | [JSON](./country-monthly.json) / [CSV](./country-monthly.csv) |
| Subdivision | [JSON](./subdivision-yearly.json) / [CSV](./subdivision-yearly.csv) | [JSON](./subdivision-monthly.json) / [CSV](./subdivision-monthly.csv) |
| Continent | [JSON](./continent-yearly.json) / [CSV](./continent-yearly.csv) | [JSON](./continent-monthly.json) / [CSV](./continent-monthly.csv) |
| World | [JSON](./world-yearly.json) / [CSV](./world-yearly.csv) | [JSON](./world-monthly.json) / [CSV](./world-monthly.csv) |

Add `-green` before the extension for the renewable-only variant, for example [country-yearly-green.json](./country-yearly-green.json) / [CSV](./country-yearly-green.csv).

## File Structure and Units

Territorial JSON uses `{ territory: { period: { technology: share } } }`. World JSON uses `{ period: { technology: share } }`, without a world wrapper. CSV has one row per territory/period, or per period for world files.

| Field | Meaning / unit |
| --- | --- |
| `country` | Country identifier, such as `FR` |
| `subdivision` | Subdivision identifier, such as `CA-QC` |
| `continent` | Continent name, not its code |
| `year` | Yearly period, `YYYY` |
| `period` | Monthly period, `YYYY-MM` |
| `Bioenergy`, `Coal`, `Gas`, `Hydro`, `Nuclear`, `Other Fossil`, `Other Renewables`, `Solar`, `Wind` | Technology shares, dimensionless fractions from 0 to 1 |

## Using the Data

Multiply a share by 100 to display a percentage. Preserve technology spelling when joining to [generation impacts](../energy/README.md). Shares may not sum to exactly one because of rounding. Missing or `null` values are unavailable, not zero.

Choose geography, period and scenario explicitly. One subdivision file does not imply coverage of every subdivision. Broader geographic averages are substitutions, not equivalent observations.

## Methodology

Source generation shares, volumes and net imports feed a modeled consumption mix. Continent/world aggregation is volume-weighted, not a simple average of country shares.

The `-green` scenario keeps **Bioenergy, Hydro, Solar and Wind**, renormalized to one. It excludes Nuclear and Other Renewables. If no eligible source is available, the scenario is unavailable. This is a hypothetical mix, not a territory's actual supply or proof of a green electricity contract.

### Missing Periods and Historical References

Missing periods can reuse earlier values. Without an earlier value, monthly series can use annual values; geographic fallbacks can use country, continent or world references. Not every filled value is individually flagged, and a current-year series need not represent complete observations.

Territories entirely absent from current Ember exports retain their previously published country series across both mix and factor variants. Later periods carry the last reference forward. These are **historical references, not new observations**. Current upstream data takes precedence when a territory returns. Preserved series are restored after aggregation: historical raw energy volumes are unavailable, so those series must not be used to invent world/continent weights.

The [provenance metadata](https://digital4better.github.io/data/electricity-provenance.json) records the pinned snapshot, territories and period coverage. In the repository and npm package it is stored at `scripts/electricity-provenance.json`, alongside the history script rather than among datasets. Original observation dates are unknown; release dates are not measurement dates.

## Sources and Attribution

Global series use [Ember electricity data](https://ember-energy.org/data/yearly-electricity-data/). Subnational inputs also use [Statistics Canada](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=2510001501) and the [US EIA](https://www.eia.gov/opendata/browser/electricity/electric-power-operational-data). See the [Digital4Better methodology](https://digital4better.github.io/methodology/en/) and preserve upstream attribution with the [ODbL license](https://opendatacommons.org/licenses/odbl/1-0/).

## Limitations

These are modeled temporal references, not real-time grid measurements. Coverage, source periods and import assumptions vary. Do not infer marginal electricity, hourly matching or a supplier's physical delivery from these shares. A fresh file timestamp does not imply a fresh observation for every value.
