# Electricity Generation Technologies

Lifecycle impact factors for producing electricity, by technology. For a territory's electricity consumption, use the [electricity factors](../factor/README.md) instead.

## Files

| Dataset | Downloads |
| --- | --- |
| Impacts by generation technology | [JSON](./energy-impacts.json) / [CSV](./energy-impacts.csv) |

## File Structure and Units

JSON is an object keyed by technology name. CSV adds that key as `energy`, with one row per technology. Every indicator is **per kWh generated**; this denominator is not repeated in each record.

| Field | Impact | Unit per kWh |
| --- | --- | --- |
| `gwp` | Climate change | kg CO2 eq/kWh |
| `ap` | Acidification | mol H+ eq/kWh |
| `ctue` | Freshwater ecotoxicity | CTUe/kWh |
| `ctuh-c`, `ctuh-nc` | Human toxicity, cancer / non-cancer | CTUh/kWh |
| `ir` | Ionising radiation | kBq U-235 eq/kWh |
| `pm` | Particulate matter | disease incidence/kWh |
| `wu` | Water use | m3 world eq/kWh |
| `adpe` | Resource use, minerals and metals | kg Sb eq/kWh |

## Using the Data

Multiply generated electricity in kWh by the selected indicator. Match technology names exactly when joining to [electricity mixes](../mix/README.md). Do not add different impact categories together; `wu` is a characterized impact, not physical water consumption in litres.

## Methodology

These lifecycle references are inputs to the electricity-factor model. A mix-weighted impact is the sum of each technology's share multiplied by its factor. Generation technology impacts are distinct from the modeled consumption mix, which also accounts for imports.

## Sources and Attribution

References include [UNECE lifecycle assessments](https://unece.org/sed/documents/2021/10/reports/life-cycle-assessment-electricity-generation-options) and [published research](https://www.sciencedirect.com/science/article/pii/S0196890422008159#b0530). See the [Digital4Better methodology](https://digital4better.github.io/methodology/en/) for context. Preserve source attribution under the repository's [ODbL license](https://opendatacommons.org/licenses/odbl/1-0/).

## Limitations

These are technology-level references, not plant measurements or operational emissions alone. The files do not provide a per-field source mapping, uncertainty interval or regional plant specification. Missing indicators are unavailable, not zero.
