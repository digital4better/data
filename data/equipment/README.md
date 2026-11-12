# Equipment Reference Data

Operational power and allocated manufacturing impacts for generic equipment, virtual machines and network categories. These are modeling references, not product-specific measurements.

## Files

| Dataset | Downloads | Purpose |
| --- | --- | --- |
| `energy` | [JSON](./energy.json) / [CSV](./energy.csv) | Operational power or network electricity intensity |
| `embodied` | [JSON](./embodied.json) / [CSV](./embodied.csv) | Allocated manufacturing impacts |

## File Structure and Units

Both JSON files are objects keyed by category. CSV adds the key as `equipment` and has one row per category.

| Field | Meaning / unit |
| --- | --- |
| `equipment` | Category identifier (CSV); JSON object key |
| `description` | Human-readable category description |
| `value` | Operational power or electricity intensity, in the entry's `unit` (`energy` only) |
| `unit` | `W` or `Wh/GB/km` for energy; `/s` or `/GB/km` for embodied impacts |

Embodied indicator units below are **per second** for `/s`, or **per gigabyte-kilometre** for the published `/GB/km` convention.

<details>
<summary>Embodied impact indicators and numerator units</summary>

| Field | Impact | Numerator unit |
| --- | --- | --- |
| `gwp`, `gwpt` | Climate change / total climate change | kg CO2 eq |
| `gwpb`, `gwplu` | Biogenic / land-use climate change | kg CO2 eq |
| `ap` | Acidification | mol H+ eq |
| `ctue` | Freshwater ecotoxicity | CTUe |
| `ctuh-c`, `ctuh-nc` | Human toxicity, cancer / non-cancer | CTUh |
| `ir` | Ionising radiation | kBq U-235 eq |
| `pm` | Particulate matter | disease incidence |
| `wu` | Water use | m3 world eq |
| `adpe` | Resource use, minerals and metals | kg Sb eq |
| `adpf` | Resource use, fossils | MJ |
| `epf`, `epm`, `ept` | Eutrophication, freshwater / marine / terrestrial | kg P eq / kg N eq / mol N eq |
| `lu` | Land use, soil quality index | Pt (dimensionless) |
| `odp` | Ozone depletion | kg CFC-11 eq |
| `pocp` | Photochemical ozone formation | kg NMVOC eq |
| `mips` | Material input per service unit | kg |

</details>

## Using the Data

- For power in W: `electricity kWh = value / 1000 * operating hours`. Apply a separately selected [electricity factor](../factor/README.md) to calculate operational impacts.
- For embodied impacts in `/s`: multiply the indicator by usage seconds. It is already time-allocated; do not divide by a device lifetime again.
- Network entries use a traffic-and-distance convention: one GB transferred over one km. Keep traffic, distance and allocation assumptions explicit.
- Do not add overlapping climate indicators such as `gwp`, `gwpt` and their components. Missing values are not zero.

## Methodology

The references separate operational electricity from manufacturing impacts allocated to use. Generic VM factors here are different from provider-specific [cloud VM references](../cloud/README.md): cloud `embodied_allocated` is in tCO2e before time amortization, not kg CO2 eq per second.

## Sources and Attribution

Digital4Better maintains these modeling inputs; see the [impact assessment methodology](https://digital4better.github.io/methodology/en/). Indicator conventions are described by the [European Commission Joint Research Centre](https://publications.jrc.ec.europa.eu/repository/bitstream/JRC130796/JRC130796_01.pdf). The files do not expose individual source URLs or lifetime assumptions for every category. Preserve attribution under the [ODbL license](https://opendatacommons.org/licenses/odbl/1-0/).

## Limitations

Values do not establish the footprint of a particular device, workload or network route. Category averages and historical allocation assumptions may differ from a real deployment. Only compare records with compatible units and boundaries; characterized water impacts are not physical litres.
