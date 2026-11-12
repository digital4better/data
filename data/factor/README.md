# Electricity Impact Factors

Lifecycle impacts per kWh of electricity consumed, by geography and period. These factors combine [electricity mixes](../mix/README.md) with [generation technology impacts](../energy/README.md).

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

Territorial JSON uses `{ territory: { period: { indicator: value } } }`. World JSON uses `{ period: { indicator: value } }`, without a world wrapper. CSV has one row per territory/period, or per period for world files.

| Field | Meaning / unit |
| --- | --- |
| `country`, `subdivision` | Source territory identifier, such as `FR` or `CA-QC` |
| `continent` | Continent name, not its code |
| `year`, `period` | Yearly `YYYY` / monthly `YYYY-MM` period |
| `gwp` | Climate change, kg CO2 eq/kWh |
| `ap` | Acidification, mol H+ eq/kWh |
| `ctue` | Freshwater ecotoxicity, CTUe/kWh |
| `ctuh-c`, `ctuh-nc` | Human toxicity, cancer / non-cancer, CTUh/kWh |
| `ir` | Ionising radiation, kBq U-235 eq/kWh |
| `pm` | Particulate matter, disease incidence/kWh |
| `wu` | Water use, m3 world eq/kWh |
| `adpe` | Resource use, minerals and metals, kg Sb eq/kWh |

## Using the Data

`impact = consumed kWh * selected factor`. For example, a fictional factor of 0.05 kg CO2 eq/kWh gives 5 kg CO2 eq for 100 kWh.

Select the exact geography, period, scenario and indicator. Check subdivisions before concluding that only national data exists, but do not assume every subdivision is covered. Missing properties, `null` and empty CSV cells are unavailable, not zero. Do not add different impact categories or interpret `wu` as physical litres.

## Methodology

Factors are technology-share-weighted lifecycle impacts for the modeled consumption mix. The [mix guide](../mix/README.md#methodology) defines import processing, volume-weighted geographic aggregation, renewable-only scenarios, missing-period fallbacks and historical-series retention. These rules apply to factor files as well; the `-green` suffix is not proof of zero-carbon electricity or a supplier contract.

## Sources and Attribution

Generation and import inputs are documented in the [mix sources](../mix/README.md#sources-and-attribution); lifecycle inputs come from the [energy references](../energy/README.md#sources-and-attribution), including Ember and UNECE respectively. Preserve source attribution under the [ODbL license](https://opendatacommons.org/licenses/odbl/1-0/).

## Limitations

Factors are not instantaneous or marginal emission measurements. Filled or carried-forward periods are not necessarily new observations. Country/continent/world values cannot silently replace missing local data; record any substitution. For fuel energy rather than grid electricity, use the separately scoped [facility factors](../facility/README.md).
