# Facility factors

Annual environmental impact factors for purchased building energy. Values are expressed per kilowatt-hour (`kWh`). Calorific bases are encoded in factor identifiers (`-pci` or `-pcs`) to keep the shared data contract flat.

## Electricity

`electricity-grid` records are copied without additional rounding from the generated Digital4Better Data annual factors:

- `FR`: [`data/factor/country-yearly.json`](../factor/country-yearly.json), key `FR`;
- `EU`: [`data/factor/continent-yearly.json`](../factor/continent-yearly.json), key `Europe`.

All nine supported impacts are retained. The build validates that these records remain identical to their source files, so an upstream electricity update must be reviewed and copied explicitly.

## Combustibles

Combustion factors come from valid generic `Elément` records in ADEME Base Carbone V23.6. The selected total includes the source's combustion and upstream components. Only GWP is published because the source does not expose the other supported impacts on the same perimeter.

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

No European wood-pellet factor is published because no equivalent valid generic record was identified. District heating and cooling are intentionally absent: their impacts depend on the local network and require a client-provided factor.
