# Hardware — experimental

The collection follows the hardware-family layout of the original D4B data repository. Each family has two separate JSON arrays, with equivalent CSV exports:

- **`<family>.json`**: hardware references, generic technologies or explicitly labelled example configurations.
- **`<family>-factors.json`**: numerical coefficients and assumptions used to estimate impacts or power.

Specifications are not impact factors. A reference does not acquire a certified footprint by being linked to a model.

## Files by family

| Family         | References                                                                              | Factors                                                                                                           |
| -------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| CPUs           | [cpus.json](./cpus.json): 140 inherited product specifications                          | [cpus-factors.json](./cpus-factors.json): base manufacturing, packaging and AI scenario assumptions               |
| Accelerators   | [accelerators.json](./accelerators.json): 38 inherited product specifications           | [accelerators-factors.json](./accelerators-factors.json): packaging and AI scenario assumptions                   |
| Semiconductors | [semiconductors.json](./semiconductors.json): nine illustrative processor process nodes | [semiconductors-factors.json](./semiconductors-factors.json): silicon coefficients and processor node multipliers |
| Memory         | [memories.json](./memories.json): DDR4, DDR5, HBM2e, HBM3                               | [memories-factors.json](./memories-factors.json): density, packaging, base manufacturing and power                |
| Storage        | [storages.json](./storages.json): SATA SSD, NVMe SSD, HDD                               | [storages-factors.json](./storages-factors.json): capacity, manufacturing and power                               |
| Screens        | [screens.json](./screens.json): LCD, OLED, e-ink                                        | [screens-factors.json](./screens-factors.json): area-based manufacturing and power                                |
| Batteries      | [batteries.json](./batteries.json): LCO, NMC, LFP                                       | [batteries-factors.json](./batteries-factors.json): capacity-based manufacturing and material content             |
| Devices        | [devices.json](./devices.json): desktop example                                         | [devices-factors.json](./devices-factors.json): desktop/custom structure and shared terminal assumptions          |
| Mobiles        | [mobiles.json](./mobiles.json): smartphone example                                      | [mobiles-factors.json](./mobiles-factors.json): structural allowance                                              |
| Tablets        | [tablets.json](./tablets.json): tablet example                                          | [tablets-factors.json](./tablets-factors.json): structural allowance                                              |
| Laptops        | [laptops.json](./laptops.json): laptop example                                          | [laptops-factors.json](./laptops-factors.json): structural allowance                                              |
| Servers        | [servers.json](./servers.json): four component configurations and six AI scenarios      | [servers-factors.json](./servers-factors.json): enclosure, auxiliary power and assembly assumptions               |

Every listed JSON has a CSV counterpart. Network hardware is not populated yet: the original `networks.json` was empty, and the imported methodology datasets do not contain a dedicated network hardware model. No fabricated product catalog or empty placeholder is added.

## How references and factors coexist

A link has the form **`file.json#record-id`**. The fragment identifies a record's `id`, not an array index. `manifest.json#models.processor` identifies a model definition in the manifest.

- CPU and accelerator IDs and specifications remain compatible with their cloud source catalogs. Their family entries in [manifest.json](./manifest.json) point to the candidate processor model; applying it requires checking the product's physical boundary.
- Technology references contain `factorRefs`. For example, `memories.json#ddr5` links to its density and packaging factors and to `semiconductors-factors.json#memory.dieGwp`.
- Example configurations contain `properties`, `technologyRefs` and `modelRef`. Numeric properties carry `value`, `unit` and `sourcePath`; categorical properties retain their original strings.
- AI server scenarios contain `factorRefs` keyed by role, such as `gpu_embodied`. That link targets the scenario-specific coefficient in `accelerators-factors.json`. Its `appliesTo` points back to the server scenario. These coefficients are not automatically assigned to similarly named catalog products.
- Each factor records `id`, `dataset`, `value`, `unit`, `status`, `source` and `sourceRevision`. Identical values from different source assumptions remain separate records when their applicability differs.

For example, `servers.json#nvidia-dgx-h100-8` has eight GPUs and references `accelerators-factors.json#nvidia-dgx-h100-8.gpu_embodied` (250,000 g CO₂e per accelerator). The scenario GPU subtotal is therefore 2,000,000 g CO₂e. This is an inherited illustrative manufacturing proxy, not a newly verified product footprint. Do not add the processor die model to this aggregate proxy.

### Semiconductors and model boundaries

Silicon coefficients are centralized without being treated as universal:

- Logic die: `cpu.dieGwp` in **kg CO₂e/mm²** and historical `cpu.dieAdpe` in **kg Sb eq/mm²**.
- Memory and SSD die: separate `memory.dieGwp` and `storage.dieGwp` records in **kg CO₂e/cm²**.
- `nodeFactors.*`: illustrative multipliers for the **processor model only**. They do not apply automatically to memory, storage or all semiconductor processes.

The [manifest](./manifest.json) describes the processor, memory, storage, display, battery, component-assembly and AI-profile models. Base manufacturing and packaging factors stay with their hardware family. Semiconductor factors are referenced rather than copied into every family.

The processor proxy covers die and packaging, not a complete accelerator card with memory and cooling. A die specification may describe one chiplet rather than the whole package. TDP is a thermal design specification, not measured average power. AI scenarios use a separate aggregate approach; they must not be summed with an overlapping component inventory.

## Status and units

| Status                                             | Meaning                                                                           |
| -------------------------------------------------- | --------------------------------------------------------------------------------- |
| `legacy-unverified`                                | Inherited product specifications without newly attached product-specific evidence |
| `historical-proxy-not-revalidated`                 | Existing coefficient whose source and representativeness still need checking      |
| `illustrative-not-calibrated`                      | Technology/model assumption for an illustration or sensitivity scenario           |
| `fictional-configurations-not-product-inventories` | Example configuration, not a manufacturer inventory                               |
| `illustrative-historical-profiles-not-calibrated`  | AI scenario combining nominal characteristics and historical assumptions          |

CPU and accelerator numeric unknowns are `null`, with a reason in `missing`; CSV cells are empty. Explicit zero values in scenarios remain zero (for example, no battery in the desktop example). Catalog `model` is a string; an empty suffix can identify a base model through `serie`, such as Apple M1.

Catalog units are recorded in the manifest. Accelerator memory retains the legacy GB convention; GB versus GiB needs verification. Configuration storage is **GB for terminals and TB for servers**. AI capacities are in bytes, and AI manufacturing assumptions in **g CO₂e**, while component model GWP factors are in **kg CO₂e**. No lifetime allocation or implicit unit conversion is applied during export.

AI names such as “DGX H100 (4 GPU)” and the inherited “BG300 NVL72” label identify illustrative scenarios, not confirmed marketed configurations. FLOP/s requires a precision and sparsity convention before comparison. The historical CPU ADPe coefficients do not establish a whole-equipment ADPe footprint. Indicators without compatible factors remain unassessed.

Existing time-normalized whole-equipment factors in [`../equipment`](../equipment) remain separate and must not be added to overlapping component estimates.

## Sources and regeneration

The source catalogs remain [`../cloud/cpus.json`](../cloud/cpus.json) and [`../cloud/accelerators.json`](../cloud/accelerators.json). The original local hardware example contained 111 CPUs and 33 accelerators, all already present in these expanded catalogs. Its other hardware files were empty.

The three methodology source snapshots are stored under `scripts/hardware-sources/` in the Git checkout, outside the distributed hardware collections. Their exact pinned upstream URLs, revisions and SHA-256 hashes are in the manifest. They preserve the original metadata and remain the source for generation; the family files replace the former public catch-all `parameters.json` and snapshot CSVs. [provenance.json](./provenance.json) records the inputs used for the exports. Source attribution and rights remain applicable alongside ODbL.

From the repository checkout with Node 24:

```sh
yarn build:hardware
yarn test:hardware
```

These commands run offline without third-party dependencies. Edit the cloud catalogs or deliberately update a source snapshot and its manifest hash, then regenerate. Do not hand-edit generated family JSON/CSV files. The npm data package contains the family exports and provenance; regeneration requires the Git checkout with its scripts and source snapshots.

Validation covers input checksums, explicit units, unknown values, duplicate IDs, complete migration of all numeric parameters, resolvable cross-file references, deterministic generation and export freshness. The dedicated branch CI validates without publishing.
