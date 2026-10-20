# Hardware reference data — experimental

This first collection brings together hardware specifications and the parameters used by the D4B methodology v2 beta. It does **not** certify the specifications, calibrate the models or provide complete product life-cycle assessments.

## Collections

| Collection | JSON | CSV | Status |
| --- | --- | --- | --- |
| 140 processors | [cpus.json](./cpus.json) | [cpus.csv](./cpus.csv) | Inherited specifications, not independently verified |
| 38 accelerators | [accelerators.json](./accelerators.json) | [accelerators.csv](./accelerators.csv) | Inherited specifications, not independently verified |
| Component coefficients | [original snapshot](./methodology/hardware-models.json) | [hardware-models.csv](./hardware-models.csv) | Historical proxies and illustrative assumptions |
| Terminal and server configurations | [original snapshot](./methodology/hardware-configurations.json) | [hardware-configurations.csv](./hardware-configurations.csv) | Fictional examples, not manufacturer inventories |
| AI hardware scenarios | [original snapshot](./methodology/ai-hardware-profiles.json) | [ai-hardware-profiles.csv](./ai-hardware-profiles.csv) | Historical illustrative profiles, not calibrated |

[parameters.json](./parameters.json) combines the numeric parameters into records with `dataset`, `id`, `value`, `unit`, `status`, `source` and `sourceRevision`. It is an alternative representation of the three snapshots, **not an additional set of impacts to sum**. Categorical configuration fields (memory technology, display type, etc.) remain in the original JSON snapshots.

[manifest.json](./manifest.json) defines source files, units, status and snapshot hashes. [provenance.json](./provenance.json) records the exact input hashes used to generate the exports. Source rights and attribution remain applicable alongside the repository's ODbL license.

## Existing hardware example and cloud catalogs

The initial local `data/data/hardware` example contained 111 processors and 33 accelerators. Every record is already present unchanged in the current cloud catalogs, which include additional entries. Its other hardware files were empty. This collection therefore derives specifications from [`../cloud/cpus.json`](../cloud/cpus.json) and [`../cloud/accelerators.json`](../cloud/accelerators.json), without maintaining another independent list or creating empty category files.

The existing cloud files and their IDs are preserved for consumers. Edit those source catalogs and regenerate `hardware` to keep both views synchronized. A later migration to a shared hardware source can be planned separately.

The initial cloud baseline is revision `77cae4a58fadd5deb3b8d4e5577020da08f780d8`; subsequent generated views are identified by their input hashes and the containing data-repository revision. Local example inspected at revision `00097b17193d88fe0fa4609d476aa6b8a809f4eb`.

## Reading specifications

- `id` remains stable; `model` is consistently a string. An empty model suffix is retained when the family (`serie`) identifies the base product, such as Apple M1.
- Every record carries `status: legacy-unverified` and a relative `source` path. That status means product-specific numerical evidence has not been attached in this migration.
- `tdp` is in W, `process` in nm, `die` in mm², `transistors` in millions, and counts are unitless counts. Accelerator `memory` follows the inherited GB convention; the distinction between GB and GiB still needs verification.
- Missing values and legacy zero specifications are `null`, with a reason in `missing`. CSV uses an empty cell for null. The source catalog is not modified. A null does not mean zero impact or that a feature is absent.
- `cores` has different meanings across CPUs, GPUs and programmable accelerators. Compare only like-for-like quantities.
- A die area can describe a chiplet rather than a full processor package. A TDP is not average measured power. Do not directly turn either into a product footprint without resolving that boundary.

## Reading model parameters

The three JSON snapshots are copied byte-for-byte from the published methodology commit recorded in the manifest. Their SHA-256 hashes are checked. They retain original metadata, categorical parameters and, for configurations, numeric values originally stored as strings. CSV and `parameters.json` normalize numeric values to numbers and attach explicit units.

| Status | Meaning |
| --- | --- |
| `historical-proxy-not-revalidated` | Coefficient inherited from the methodology; its source and technological representativeness still need rechecking |
| `illustrative-not-calibrated` | Assumption for an illustration or sensitivity scenario |
| `fictional-configurations-not-product-inventories` | Example device or server configuration, not a measured or manufacturer-certified inventory |
| `illustrative-historical-profiles-not-calibrated` | AI scenario mixing nominal specifications and historical impact assumptions |

A zero in an illustrative configuration may intentionally mean an absent component, for example no battery in the desktop example. Unlike legacy catalog zero sentinels, these explicit scenario zeros are preserved.

### Units and equations

The numeric exports distinguish kg from g CO₂e, mm² from cm², decimal GB from TB and bytes, and W from energy. Terminal storage configurations use GB; server storage configurations use TB. No allocation over a lifetime is applied during export.

The component GWP models inherited from the methodology are:

- Processor: `(die_mm2 × cpu.dieGwp + cpu.baseGwp) × node_factor × packaging_factor × count`.
- Memory module: `(capacity_GB / density_GB_per_cm2 × memory.dieGwp + memory.baseGwp) × packaging_factor`; multiply by the number of modules, using capacity **per module**.
- SSD: `capacity_GB / storage.density × storage.dieGwp + storage.baseGwp` per drive. HDD uses a per-drive fixed proxy.
- Display: `area_cm2 × gwp_per_cm2 + base_gwp`. Battery: `capacity_Wh / 1000 × gwp_per_kWh`.

These equations describe the inherited implementation, not newly established physical laws. Manufacturing boundaries need source-specific verification. The CPU's historical ADPe constants are included for traceability; they do not establish an ADPe result for an entire device. The other environmental indicators remain unassessed when no compatible factor exists.

The aggregate accelerator manufacturing proxies in the AI scenarios must not be added to a second die, HBM or card inventory. Host enclosure allowances are distinct. The AI snapshots retain historical names such as “DGX H100 (4 GPU)” and the label “BG300 NVL72”: treat their IDs as scenario identifiers, **not confirmation of a marketed system configuration**. FLOP/s values also require a precision and sparsity convention before comparison. No current vendor specification has been newly certified here.

The existing [`equipment`](../equipment) collection remains separate. Its time-normalized whole-equipment factors are not interchangeable with the component manufacturing parameters here, and must not be added to the same components.

## Regenerate and validate

From the repository root, using Node 24:

```sh
yarn build:hardware
yarn test:hardware
```

These commands work offline without installing third-party packages. The hardware export also runs before the main data-generation pipeline. `test:hardware` checks null handling, invalid and duplicate specifications, explicit units, snapshot integrity, deterministic CSV/JSON generation and export freshness. The dedicated hardware CI is read-only and does not publish the branch.

Generated files: `cpus.*`, `accelerators.*`, the three parameter CSVs, `parameters.json`, `provenance.json`. Update source catalogs or deliberately replace a methodology snapshot together with its manifest entry, then regenerate. Do not edit generated files manually.

## Next qualification work

Attach a product-specific primary source to each retained specification, including date, exact variant, units and physical boundary. For impact parameters, add the indicator method, life-cycle phases, applicability, uncertainty and independent calibration evidence. Promote records individually only when that evidence exists; do not silently convert inherited values into verified data.
