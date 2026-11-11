# Facility Reference Data

Annual environmental impact factors for purchased building energy. Values are expressed per kilowatt-hour (`kWh`). Calorific bases are encoded in factor identifiers (`-pci` or `-pcs`) to keep the shared data contract flat.

## Files

| File | Purpose |
| --- | --- |
| [factors.json](./factors.json) · [factors.csv](./factors.csv) | Annual electricity and fuel impact factors |

## File Structure and Units

JSON is an array of factor objects; CSV has one row per object. A record is identified by the combination of `id`, `location` and `period`, not `id` alone.

| Field | Type / unit | Meaning |
| --- | --- | --- |
| `id` | Text | Energy or travel-mode identifier. |
| `location` | Text code | Reference geography, such as `FR` or `EU`. |
| `period` | Year string (`YYYY`) | Reference period; check whether it is a source year or snapshot year. |
| `unit` | `kWh` | Purchased energy quantity. This is the denominator for every impact. |
| `source` | Text | Source name or description. |
| `sourceUrl` | URL | Source record, API request or underlying dataset. |
| Impact fields below | Numbers | Environmental impacts per functional unit. |

<details>
<summary>Environmental impact columns and units</summary>

| Field | Indicator | Numerator unit |
| --- | --- | --- |
| `adpe` | Resource use, minerals and metals | kg Sb eq |
| `ap` | Acidification | mol H+ eq |
| `ctue` | Freshwater ecotoxicity | CTUe |
| `ctuh-c` | Human toxicity, cancer | CTUh |
| `ctuh-nc` | Human toxicity, non-cancer | CTUh |
| `gwp` | Climate change | kg CO2 eq |
| `ir` | Ionising radiation | kBq U-235 eq |
| `pm` | Particulate matter | disease incidence |
| `wu` | Water use | m3 world eq |

Divide the numerator unit by the record's `unit`: for example, kg CO2 eq/kWh. Water-use equivalents are not physical litres of water. Electricity records expose all nine indicators; fuel records expose GWP only. Missing fields and empty cells mean unavailable, not zero.

</details>

## Using the Data

Match the factor's location, period and energy basis to your consumption. Multiply each impact factor by energy in kWh. For example, `gwp` is in kgCO2e/kWh. Missing indicators are unavailable, not zero.

Fuel IDs ending in `-pci` use the lower calorific value; `-pcs` uses the higher value. Do not mix the two bases.

## Methodology

### Electricity

`electricity-grid` records are copied without additional rounding from the generated Digital4Better Data annual factors:

- `FR`: [`data/factor/country-yearly.json`](../factor/country-yearly.json), key `FR`;
- `EU`: [`data/factor/continent-yearly.json`](../factor/continent-yearly.json), key `Europe`.

All nine supported impacts are retained. Electricity values follow the annual factors; fuel factors use their own source periods.

### Fuels

Fuel totals include combustion and upstream components. Only GWP is published because equivalent values for the other indicators are unavailable.

## Sources and Attribution

Electricity uses the Digital4Better annual factors linked above. Fuels use generic records from [ADEME Base Carbone](https://base-empreinte.ademe.fr/), version V23.6. Source years are retained rather than presented as current-year observations.

<details>
<summary>Fuel source records</summary>

| Factor             | Location | Period | Base Carbone element |
| ------------------ | -------- | -----: | -------------------: |
| `natural-gas-pci`  | FR       |   2025 |                37132 |
| `natural-gas-pcs`  | FR       |   2025 |                37133 |
| `natural-gas-pci`  | EU       |   2018 |                13515 |
| `natural-gas-pcs`  | EU       |   2017 |                15312 |
| `heating-oil-pci`  | FR       |   2017 |                14085 |
| `heating-oil-pci`  | EU       |   2017 |                14084 |
| `propane-pci`      | FR       |   2017 |                13558 |
| `propane-pci`      | EU       |   2017 |                13557 |
| `wood-pellets-pci` | FR       |   2025 |                34942 |

</details>

## Limitations

No European wood-pellet factor is published because no equivalent valid generic record was identified. District heating and cooling are absent: their impacts depend on the local network and require a network-specific factor. Do not substitute another location or energy basis without an explicit methodological choice.
