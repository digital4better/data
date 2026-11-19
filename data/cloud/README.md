# Cloud Reference Data

Cloud regions, virtual machines, modeled hosts, CPUs and accelerators for AWS, Azure, GCP, Oracle, OVHcloud and Scaleway. Historical offers are retained; an entry does not guarantee current availability.

## Files

Each provider has separate region, VM and host catalogs, available as JSON and flat CSV.

| Provider | Regions | VMs | Hosts |
| --- | --- | --- | --- |
| AWS | [JSON](./aws-regions.json) · [CSV](./aws-regions.csv) | [JSON](./aws-vms.json) · [CSV](./aws-vms.csv) | [JSON](./aws-hosts.json) · [CSV](./aws-hosts.csv) |
| Azure | [JSON](./azure-regions.json) · [CSV](./azure-regions.csv) | [JSON](./azure-vms.json) · [CSV](./azure-vms.csv) | [JSON](./azure-hosts.json) · [CSV](./azure-hosts.csv) |
| GCP | [JSON](./gcp-regions.json) · [CSV](./gcp-regions.csv) | [JSON](./gcp-vms.json) · [CSV](./gcp-vms.csv) | [JSON](./gcp-hosts.json) · [CSV](./gcp-hosts.csv) |
| Oracle | [JSON](./oracle-regions.json) · [CSV](./oracle-regions.csv) | [JSON](./oracle-vms.json) · [CSV](./oracle-vms.csv) | [JSON](./oracle-hosts.json) · [CSV](./oracle-hosts.csv) |
| OVHcloud | [JSON](./ovhcloud-regions.json) · [CSV](./ovhcloud-regions.csv) | [JSON](./ovhcloud-vms.json) · [CSV](./ovhcloud-vms.csv) | [JSON](./ovhcloud-hosts.json) · [CSV](./ovhcloud-hosts.csv) |
| Scaleway | [JSON](./scaleway-regions.json) · [CSV](./scaleway-regions.csv) | [JSON](./scaleway-vms.json) · [CSV](./scaleway-vms.csv) | [JSON](./scaleway-hosts.json) · [CSV](./scaleway-hosts.csv) |

Shared hardware references: CPUs ([JSON](./cpus.json), [CSV](./cpus.csv)) and accelerators ([JSON](./accelerators.json), [CSV](./accelerators.csv)).

## File Structure and Units

Records may include optional JSON-only [`fields` assessments](../field-assessments.md): `supported`, `estimated`, `tentative` or `missing` per top-level property. An unannotated field is not assessed. CSV layouts are unchanged; the existing AI `estimated` column is derived from these states. Required fields and evidence rules still apply.

CPU and accelerator catalogs cover hardware referenced by cloud VMs and hosts, including historical records; they are not exhaustive manufacturer catalogs. Add hardware together with its evidenced VM/host reference. Existing orphan references require historical review, not automatic deletion.

Every JSON file contains an array of objects; its CSV counterpart has one row per object. Optional fields may be absent or empty. Some historical numeric values are decimal strings: preserve their value when parsing. Hardware zeros can be legacy placeholders rather than verified measurements.

<details>
<summary>Regions: identifiers, locations and environmental indicators</summary>

| Field | Type / unit | Meaning |
| --- | --- | --- |
| `id`, `name`, `provider` | Text | Region identifier, display name and provider. |
| `location` | Text | Locality, not a datacenter address. |
| `country`, `subdivision` | Text codes | Geographic identifiers; country codes generally use lowercase ISO alpha-2. |
| `lat`, `lon` | Decimal degrees | Approximate latitude and longitude. |
| `pue` | Dimensionless ratio | Facility energy divided by IT energy. |
| `wue` | L/kWh | Water usage per IT energy; check the source boundary. |
| `ref` | Fraction, 0 to 1 | Renewable-energy reference or documented CFE proxy. |
| `aliases` | String array | Alternative region identifiers (JSON-only). |
| `partition` | Text | Provider partition, when specified (JSON-only). |
| `sources` | URL array | Evidence references (JSON-only); interpretation and limits are documented below. |

</details>

<details>
<summary>VMs: capacity and allocated manufacturing impact</summary>

| Field | Type / unit | Meaning |
| --- | --- | --- |
| `id`, `name`, `family`, `category` | Text | Identifier, offer name, family and usage category. |
| `vcpus` | Count | Virtual CPUs, not necessarily physical cores. |
| `memory` | GB or GiB | Instance RAM in the source convention; see Capacity Units below. |
| `ssd`, `hdd` | GB or GiB | Included local storage capacity, not drive count. |
| `cpu` | ID or array of IDs | Alternative CPU references; CSV joins arrays with commas. |
| `accelerator` | ID | Reference in `accelerators.json`. |
| `accelerators` | Count, possibly fractional | Allocated accelerator units; slices need not be whole boards. |
| `embodied_allocated` | tCO2e | Manufacturing impact allocated to this instance before time amortization. |
| `embodied` | tCO2e | Deprecated compatibility value; historical allocation scope varies. |
| `host` | ID | Profile in the same provider's host catalog. |
| `host_instances` | Positive integer | Maximum modeled number of identical instances per host. |
| `virtual` | Boolean | `false` for bare metal (JSON-only). |
| `provider`, `shape` | Text | Provider or original shape, when specified (JSON-only). |
| `ocpus` | Oracle OCPU count | Provider allocation unit; conversion to vCPUs depends on platform (JSON-only). |
| `flex` | Boolean | A selected configuration of a flexible shape (JSON-only). |

</details>

<details>
<summary>Hosts: modeled physical capacity and manufacturing impact</summary>

| Field | Type / unit | Meaning |
| --- | --- | --- |
| `id`, `name`, `provider` | Text | Host profile identifier, label and provider. |
| `basis`, `method` | Text codes | Profile origin and calculation version. |
| `vcpus` | Count | Modeled allocatable vCPU capacity. |
| `memory` | GB or GiB | Modeled host RAM, retaining the source convention. |
| `sockets` | Integer count | Modeled physical CPU sockets. |
| `cpu` | Array of IDs | Alternative CPU references; CSV joins them with commas. |
| `ssd_count`, `hdd_count` | Integer counts | Modeled physical drives. |
| `ssd_capacity`, `hdd_capacity` | GB or GiB | Known local storage capacities used as allocation limits. |
| `accelerator`, `accelerators` | ID / integer count | Accelerator reference and modeled board count. |
| `accelerator_memory` | GB per board | Memory used by the manufacturing model. |
| `embodied` | tCO2e | Whole-host manufacturing impact; this field is not deprecated on hosts. |
| `sources`, `assumptions` | URL array / code array | Evidence and modeling choices; CSV uses ` | ` between items. |

</details>

<details>
<summary>CPUs and accelerators: shared hardware references</summary>

| Field | Type / unit | Meaning |
| --- | --- | --- |
| `id`, `manufacturer`, `serie`, `model` | Identifiers / labels | Component identity; some historical model labels are numeric. |
| `architecture`, `platform` | Text | Architecture (CPU) and platform/generation. |
| `type` | Text | Accelerator class, such as GPU, ASIC or FPGA. |
| `cores`, `threads` | Counts | Hardware cores and CPU threads; accelerator cores are not CPU-equivalent. |
| `memory` | GB | Accelerator memory; verify whether the reference describes a chip or a multi-chip board. |
| `tdp` | W | Thermal design envelope, not measured workload power. |
| `process` | nm convention | Reported process node, not a measured physical feature size. |
| `die` | mm2 | Reported die area; legacy chiplet/package boundaries can differ. |
| `transistors` | Millions | Reported transistor count. |
| `smp` | Socket count | CPU maximum socket support, not installed host sockets. |

</details>

## Using the Data

- Join a VM's `host` to an `id` in the same provider's host catalog. CPU and accelerator IDs refer to the shared hardware catalogs.
- **Use VM `embodied_allocated` for manufacturing impact**, in tCO2e before lifetime/time amortization. Host `embodied` describes the whole modeled host.
- **VM `embodied` is deprecated.** Previously populated values are retained; previously missing values use the allocated impact. Its historical scope is inconsistent: do not assume it always describes a host or a VM.
- Missing properties and empty CSV cells mean unavailable data, not zero. Regions without coordinates are usable in downloads but not plotted on the map.
- CPU arrays list alternative processors, not socket counts. Fractional accelerator quantities describe VM allocations; host counts describe physical board equivalents. Bare metal uses `virtual: false`.
- `ssd` and `hdd` describe included local storage, not optional network disks. Host `sources` and `assumptions` arrays are joined with ` | ` in CSV.

### Capacity Units

Capacity numbers retain their source convention: **GB and GiB are not interchangeable**. The following conventions apply to reviewed specifications, not every historical entry.

| Provider | RAM | Local storage |
| --- | --- | --- |
| AWS | GiB | GB |
| Azure | Mostly GiB; some series publish GB | GB or GiB depending on series |
| GCP | GB | GiB |
| Oracle | GB | GB |
| OVHcloud | GB | GB |
| Scaleway | GiB | Check the individual source |

Azure GB RAM exceptions include Dnsv6, Dnlsv6, Ensv6, HBv5, Esv7, Ebsv6, Ebdsv6, Ecasv6 and Ecadsv6. Local storage is GB for Lsv4, Lasv4 and Lasv5/Laosv5; GiB for Ddsv7, Dldsv7, Daldsv7, Dcadsv6, Famdsv7 and Faldsv7. TB/TiB totals are reduced to GB/GiB respectively.

Region `pue` is a ratio, `wue` is L/kWh and `ref` is a fraction. Reporting boundaries differ: Google's CFE fraction is not interchangeable with renewable-energy matching. AWS `ref = 0` and Oracle `wue = 0` are dataset conventions, not verified absence of renewable energy or water use.

### Regional Environmental References

| Provider | Source and interpretation |
| --- | --- |
| AWS | [Regional PUE/WUE disclosures](https://sustainability.aboutamazon.com/products-services/aws-cloud); current regional measurements are used when published. The older CSV remains a historical reference. REF remains zero by convention. |
| Azure | [Datacenter efficiency disclosures](https://datacenters.microsoft.com/sustainability/efficiency/) and regional fact sheets, including curated historical values whose original PDFs may no longer be retrievable. |
| GCP | [Regional carbon data](https://cloud.google.com/sustainability/region-carbon); CFE is used as the REF proxy. Previously derived water values remain pending clearer regional disclosures. |
| Oracle | [OCI environmental reporting](https://www.oracle.com/a/ocom/docs/corporate/citizenship/clean-cloud-oci.pdf); renewable matching is distinct from physical grid emissions. Uniform PUE 1.07 and provisional WUE zero remain reference assumptions. |
| OVHcloud | [FY25 environmental KPIs](https://www.ovhcloud.com/sites/default/files/external_files/kpis_fy25.pdf). |
| Scaleway | [Calculation reference](https://www.scaleway.com/en/docs/environmental-footprint/additional-content/calculation-values-reference/) and datacenter impact reports. |

Compare reporting periods and regional versus global boundaries before comparing providers. Lower PUE alone does not imply a lower total environmental impact.


#### Reviewed regional periods and limits

AWS directly reported regional PUE/WUE values use calendar 2025 where available; absent disclosures retain their earlier reference or estimate. Aggregate-derived values in the table below still refer to 2024. Thailand (`ap-southeast-7`) now uses regional 2025 PUE 1.38; its WUE remains the earlier Asia-Pacific aggregate estimate. The source may revise earlier columns, so the retained CSV is not the latest annual feed.

Google regional `ref` uses the published 2025 CFE percentage divided by 100. No new campus-to-region PUE or water mapping is inferred from the separate datacenter efficiency tables. `asia-southeast3` still lacks a regional CFE disclosure.

Oracle `ref=1` for the 43 matched commercial-region keys represents FY2026 annual renewable electricity matching (June 2025–May 2026), not carbon-free supply every hour or zero physical grid emissions. `ap-kulai-2` and `af-casablanca-1` retain their historical zero placeholders: the former is key JBP while the report lists a different Kulai key FYV; the latter is absent from the regional table. Neither zero is a measured renewable share.

#### Reviewed VM and hardware evidence

Azure Cobalt 200 families `dpsv7`, `dpdsv7`, `dplsv7`, `dpldsv7`, `epsv7`, `epdsv7`, `mpsv4`, `mpdsv4` and `lpsv5` use the published sizes, not a Cartesian product. Family host envelopes use the largest observed vCPU, RAM and local-storage limits as an explicit scenario, with one assumed socket and modeled physical disks. These are not installed host inventories. Local disk totals are count × per-disk size; storage is GiB for the D/E/M variants and GB for Lpsv5. Cobalt 200 uses 132 Arm Neoverse V3 cores per SoC on TSMC’s 3 nm process. Its die area and TDP remain unknown.

Other added Azure sizes use the maximum allocated result among compatible existing profiles of the same family; where none fits, a dedicated-equivalent scenario is allocated at 100%, with the socket and storage assumptions recorded in the input profile. The two M-family additions without an exact CPU SKU keep that field absent rather than assigning a processor from a generation label.

GCP `a5x-highgpu-4g-metal` exposes 176 vCPUs, 1,440 GB RAM, four 12,000 GiB local SSDs and four Rubin GPUs. Its two Vera sockets each have 88 physical cores and support 176 hardware threads; those hardware specifications do not change the published guest vCPU count. Each Rubin GPU has 288 GB HBM4. The bare-metal impact scenario allocates the full envelope once and excludes additional interconnect hardware. Capacity requires coordination with the provider; inclusion does not guarantee an immediately allocatable instance.

The corrected GCP M4 RAM values (31/62/124 GB for `m4-hypermem-2/-4/-8`) change placement counts and `embodied_allocated`; the historical `embodied` values are pinned in the calculator inputs. Azure `nd96isr-h200-v5` RAM is 1,850 GiB; its existing physical host scenario is retained.

AWS `m1-medium`, `r3-large` and `t1-micro` RAM values remain historical and `tentative`: the [previous-generation product page](https://aws.amazon.com/ec2/previous-generation/) and [EC2 specification table](https://docs.aws.amazon.com/ec2/latest/instancetypes/pg.html) disagree or differ in rounding. No RAM or impact change is inferred from that disagreement.

#### Regional estimate scope

The following regions retain PUE/WUE estimates from geographic aggregates, **not measurements of the individual cloud region**. This table replaces their former JSON `notes`; values and CSV exports are unchanged. Records retain evidence URLs in `sources`; field assessments, when present, do not replace these methodological limits.

| Provider | Region IDs | Aggregate used | Reporting period |
| --- | --- | --- | --- |
| AWS | `ap-east-2`, `ap-southeast-6` | Asia Pacific excluding China | 2024 |
| AWS | `ap-southeast-7` (WUE only) | Asia Pacific excluding China | 2024 |
| AWS | `mx-central-1` | North America | 2024 |
| AWS | `eusc-de-east-1` | Europe | 2024 |
| Azure | `be-central` | Europe, Middle East & Africa | FY25 |
| Azure | `cl-central` | Americas | FY25 |
| Azure | `my-west` | Asia Pacific | FY25 |

For these AWS regions, the source predates the region's launch. For these Azure regions, FY25 covers July 2024–June 2025 and fully owned and controlled datacenters operational for 12 months. Actual local performance may differ from the aggregate in both cases. WUE is in L/kWh.

For all regions in this table, coordinates approximate the locality rather than a datacenter address. AWS `ref=0` follows the dataset convention; Azure `ref=0` is a conservative fallback without region-specific renewable-energy evidence. Neither represents a measured zero renewable-energy share. Dataset records no longer carry free-text `notes`; retain these public explanations when using their values.

## Methodology

The D4B method `d4b-host-v1` estimates host manufacturing impact from its modeled components:

```text
host kgCO2e = 1000
            + (RAM - 16) × 1.3869
            + (sockets - 1) × 100
            + SSD count × 100
            + HDD count × 50
            + accelerator count × (150 + max(0, accelerator memory - 16) × 1.3869)

embodied_allocated = host.embodied / host_instances
```

Host RAM is at least 16 GB; the base already includes those 16 GB and one socket. Divide kgCO2e by 1000 for tCO2e. Accelerator memory is per modeled board. The VRAM extension and its application to ASIC/FPGA are D4B approximations; unknown accelerator memory uses a documented 16 GB placeholder.

`host_instances` is the maximum modeled number of **identical** VMs fitting the host, constrained by CPU, RAM, accelerators, known local storage and documented placement limits. The whole host impact, including unused capacity, is divided among those instances. Bare metal and dedicated-equivalent fallbacks use one. Do not allocate the host share a second time or treat this count as observed occupancy.

Among compatible modeled hosts, the method selects the highest per-instance impact. This is a conservative policy, not a proven physical upper bound.

**Example:** a modeled Azure Dsv6-Type1 host has an impact of 2.4979952 tCO2e. Microsoft's [placement table](https://learn.microsoft.com/en-us/azure/virtual-machines/dedicated-hosts/general-purpose-skus#dsv6) allows 32 D2s_v6 instances, giving 0.07806235 tCO2e per instance. The profile assumes two sockets; the table does not independently verify them.

### Assumption Codes

`basis` describes the profile's origin; `method` identifies the calculation version. `assumptions` contains short codes, while numeric choices remain in the host fields and evidence URLs in `sources`.

<details>
<summary>Assumption code glossary</summary>

| Code | Meaning |
| --- | --- |
| `historical-host` | Historical source configuration, not inferred from an old impact. |
| `cpu-proxy` | Instance CPU reference used as a host proxy. |
| `max-impact` | Highest allocated result among compatible modeled candidates. |
| `published-sockets` | Socket count from a compatible dedicated-host family. |
| `inferred-sockets` | Sockets inferred from CPU capacity or architecture defaults. |
| `baremetal-proxy` | Bare-metal resources proxy the physical host. |
| `family-proxy` | Compatible family configuration proxies the host. |
| `largest-size-vcpu` | Largest matching SKU supplies vCPU capacity, without another SMT multiplier. |
| `catalog-proxy` | Largest matching SKU supplies the modeled host configuration. |
| `dedicated-host-proxy` | Dedicated-host capacity proxies ordinary VM hosting. |
| `sole-tenant-proxy` | Sole-tenant capacity and sockets proxy ordinary VM hosting. |
| `dedicated-fallback` | Unknown mapping: dedicated-equivalent envelope allocated at 100%. |
| `desktop-fallback` | Desktop uses a rack-equivalent base, not a product LCA. |
| `one-ssd` | One physical local SSD assumed. |
| `one-hdd` | One physical local HDD assumed. |
| `storage-proxy` | Physical drive count is modeled, not a count of guest partitions. |
| `non-gpu-proxy` | ASIC/FPGA uses the GPU board/memory coefficients. |
| `accelerator-memory-default` | Unknown accelerator memory uses 16 GB. |
| `gpu-host-proxy` | Full GPU-family configuration proxies the host. |
| `hbm-ram-proxy` | HBM uses the ordinary RAM coefficient. |
| `installed-ram-proxy` | Installed RAM is modeled rather than copied from guest-available RAM. |
| `storage-pools` | Diskless and local-storage variants use separate host pools. |
| `cpu-generation-proxy` | Host envelope is specific to the modeled CPU generation. |
| `interconnect-excluded` | Additional interconnect hardware is excluded. |
| `installed-vram` | Installed GPU memory is used instead of guest-usable memory. |
| `remote-storage-excluded` | Remote block storage is excluded. |

</details>

## Sources and Attribution

| Provider | Regions | Machines |
| --- | --- | --- |
| AWS | [Region catalog](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html) | [EC2 specifications](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html) |
| Azure | [Region catalog](https://learn.microsoft.com/en-us/azure/reliability/regions-list) | [VM sizes](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/overview) |
| GCP | [Regions and zones](https://docs.cloud.google.com/compute/docs/regions-zones) | [Machine families](https://docs.cloud.google.com/compute/docs/machine-resource), [CPU platforms](https://docs.cloud.google.com/compute/docs/cpu-platforms) |
| Oracle | [Regions](https://docs.oracle.com/en-us/iaas/Content/General/Concepts/regions.htm) | [Compute shapes](https://docs.oracle.com/en-us/iaas/Content/Compute/References/computeshapes.htm) |
| OVHcloud | [Public Cloud availability](https://www.ovhcloud.com/en/public-cloud/regions-availability/) | [Prices and specifications](https://www.ovhcloud.com/en/public-cloud/prices/) |
| Scaleway | [Region identifiers](https://www.scaleway.com/en/developers/cli/config) | [Instance datasheet](https://www.scaleway.com/en/docs/instances/reference-content/instances-datasheet/) |

Hardware references also use manufacturer specifications and, where explicitly identified, observed guest CPU models from [Spare Cores](https://sparecores.com/), [Vantage](https://instances.vantage.sh/) and [Cloud Mercato](https://pcr.cloud-mercato.com/). OVHcloud T1/T2 guest CPU observations are not provider-wide guarantees.

#### CPU and GPU specifications

The following values describe one physical CPU or GPU module. The process column uses the nominal compute-die node. Power values describe manufacturer design envelopes in watts. GPU core counts use the vendor’s scalar processing units.

| Hardware ID | Assessed properties | Evidence and scope |
| --- | --- | --- |
| `amd-epyc-7j13` | `process` 7 | OCI E4 Milan compute die. [OCI shapes](https://docs.oracle.com/en-us/iaas/Content/Compute/References/computeshapes.htm) · [Oracle E4/E5 comparison](https://blogs.oracle.com/cloud-infrastructure/e5-standard-instance-4th-gen-amd-epyc-processors) · [AMD EPYC architecture](https://www.amd.com/content/dam/amd/en/documents/products/epyc/4th-gen-epyc-processor-architecture-white-paper.pdf) |
| `amd-epyc-9004`, `amd-epyc-9j14` | `process` 5 | Genoa compute die; the family-only 9004 entry has no single core count or TDP. [AMD EPYC architecture](https://www.amd.com/content/dam/amd/en/documents/products/epyc/4th-gen-epyc-processor-architecture-white-paper.pdf) · [Oracle E4/E5 comparison](https://blogs.oracle.com/cloud-infrastructure/e5-standard-instance-4th-gen-amd-epyc-processors) · [OCI shapes](https://docs.oracle.com/en-us/iaas/Content/Compute/References/computeshapes.htm) |
| `amd-epyc-9555p` | `process` 4 | The 9555P row identifies a Zen 5 CCD; AMD specifies 4 nm for Zen 5 and 3 nm for Zen 5c. [AMD EPYC 9005 SKU table](https://www.amd.com/content/dam/amd/en/documents/epyc-business-docs/datasheets/amd-epyc-9005-series-processor-datasheet.pdf) · [AMD Zen 5 architecture](https://docs.amd.com/api/khub/documents/UIqhAbjRhgnzgzzdVU4pUw/content) |
| `ampere-ampereone-a16030` | `process` 5 | AmpereOne process. The SKU table reports workload power separately from the family TDP range. [AmpereOne](https://amperecomputing.com/en/briefs/ampereone-family-product-brief) · [OCI shapes](https://docs.oracle.com/en-us/iaas/Content/Compute/References/computeshapes.htm) |
| `ampere-ampereone-m-19236m`, `ampere-ampereone-m-a0636m` | `process` 5 | TSMC process for the AmpereOne M family used by OCI. [AmpereOne M](https://amperecomputing.com/en/briefs/ampereone-m-product-brief) · [OCI shapes](https://docs.oracle.com/en-us/iaas/Content/Compute/References/computeshapes.htm) |
| `apple-m3-ultra-28` | `process` 3 | UltraFusion joins two M3 Max dies fabricated on the M3 family process. [Apple M3 Ultra](https://www.apple.com/newsroom/2025/03/apple-reveals-m3-ultra-taking-apple-silicon-to-a-new-extreme/) · [Apple M3 Max](https://www.apple.com/newsroom/2023/10/apple-unveils-m3-m3-pro-and-m3-max-the-most-advanced-chips-for-a-personal-computer/) |
| `apple-m4-max-16` | `process` 3 | Second-generation 3 nm for the M4 Max SoC. [Apple M4 Max](https://www.apple.com/newsroom/2024/10/apple-introduces-m4-pro-and-m4-max/) |
| `aws-graviton-5` | `process` 3 | AWS specifies its chip manufacturing process. [AWS Graviton5](https://www.aboutamazon.com/news/aws/aws-graviton-5-cpu-amazon-ec2) |
| `azure-cobalt-200` | `cores` 132, `process` 3 | Physical Arm cores per SoC and TSMC process. [Microsoft Cobalt 200](https://azure.microsoft.com/en-us/blog/azure-cobalt-200-vms-now-available-proven-on-real-workloads-and-built-for-the-agentic-era/) |
| `intel-xeon-4214` | `process` 14 | Lithography for the Silver 4214. [Intel ARK 4214](https://www.intel.com/content/www/us/en/products/sku/193385/intel-xeon-silver-4214-processor-16-5m-cache-2-20-ghz/specifications.html) |
| `intel-xeon-6226r` | `cores` 16, `tdp` 150, `process` 14 | Gold 6226R socket specifications. [Intel ARK 6226R](https://www.intel.com/content/www/us/en/products/sku/199347/intel-xeon-gold-6226r-processor-22m-cache-2-90-ghz/specifications.html) |
| `intel-xeon-6985pc` | `cores` 72 | On c4-standard-288-metal, the two SMBIOS Type 4 records identify the exact 6985P-C and each report 72 physical cores, 72 enabled and 144 threads. [Spare Cores SMBIOS capture](https://github.com/SpareCores/sc-inspector-data/blob/8498ce04b618d4589a63d6eff0b39e4e1bff33ab/data/gcp/c4-standard-288-metal/0/dmidecode/stdout) · [GCP bare-metal types](https://docs.cloud.google.com/compute/docs/general-purpose-machines) |
| `intel-xeon-8592plus` | `tdp` 350 | Default processor TDP. [Intel ARK 8592+](https://www.intel.com/content/www/us/en/products/sku/237261/intel-xeon-platinum-8592-processor-320m-cache-1-90-ghz/specifications.html) |
| `intel-xeon-8592plus`, `intel-xeon-sapphire-rapids` | `process` 10 | Intel 7, formerly 10 nm Enhanced SuperFin. The numeric value follows the existing Emerald/Sapphire Rapids convention. [Intel ARK 8592+](https://www.intel.com/content/www/us/en/products/sku/237261/intel-xeon-platinum-8592-processor-320m-cache-1-90-ghz/specifications.html) · [Intel Sapphire Rapids](https://download.intel.com/newsroom/2021/client-computing/intel-architecture-day-2021-fact-sheet.pdf) · [Intel process names](https://download.intel.com/newsroom/2021/client-computing/accelerating-process-innovation.pdf) |
| `amd-radeon-mi355x` | `cores` 16384, `tdp` 1400, `process` 3 | Stream processors, maximum module TBP and nominal compute process. AMD also specifies 6 nm for the other die technology. [AMD MI355X](https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html) |
| `nvidia-blackwell-b200-192` | `process` 4, `tdp` 1200 | Blackwell GPU in the Azure GB200 NVL72 configuration: TSMC 4NP and configurable maximum TDP per GPU. The HGX B200 column has a different power limit. [Azure GB200 configuration](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/gpu-accelerated/nd-gb200-v6-series) · [NVIDIA Blackwell process](https://nvidianews.nvidia.com/news/nvidia-blackwell-platform-arrives-to-power-a-new-era-of-computing/) · [NVIDIA Blackwell datasheet](https://productinformation.ocf.co.uk/media/nvldqqds/blackwell-datasheet-4204213.pdf) |
| `nvidia-rtx-pro-4500-blackwell-server` | `process` 4 | The RTX PRO 4500 uses the RTX Blackwell GB203 die, fabricated on TSMC 4N. [NVIDIA supported GPUs](https://docs.nvidia.com/datacenter/tesla/pdf/MIG_User_Guide.pdf) · [NVIDIA RTX PRO architecture](https://www.nvidia.com/content/dam/en-zz/Solutions/design-visualization/quadro-product-literature/NVIDIA-RTX-Blackwell-PRO-GPU-Architecture-v1.0.pdf) |
| `nvidia-rubin` | `cores` 28672 | 224 streaming multiprocessors × 128 CUDA cores per Rubin SM (compute capability 10.7). [NVIDIA Rubin SM count](https://developer.nvidia.com/blog/inside-nvidia-rubin-gpu-architecture-powering-the-era-of-agentic-ai/) · [NVIDIA CUDA mapping](https://github.com/NVIDIA/cuda-samples/blob/0ec046d5e99d7214cc8e9fbac2cc1e66f3019878/Common/helper_cuda.h#L646-L681) |
| `nvidia-tesla-v100s32` | `process` 12 | Volta V100S 32 GB; GV100 uses TSMC 12 nm FFN. [NVIDIA V100S](https://images.nvidia.com/content/technologies/volta/pdf/volta-v100-datasheet-update-us-1165301-r5.pdf) · [NVIDIA Volta](https://images.nvidia.com/content/volta-architecture/pdf/volta-architecture-whitepaper.pdf) |


#### Estimated TDP for custom Oracle CPUs

For the three entries below, `fields.tdp` is `estimated`. The value in watts per physical processor is the default TDP of a catalog CPU of the same generation and physical core count, selected using the base and maximum boost clocks of the [OCI Standard bare-metal shapes](https://docs.oracle.com/en-us/iaas/Content/Compute/References/computeshapes.htm). Oracle's configured power limit is unknown.

| Hardware ID | Catalog CPU | TDP estimate | Basis |
| --- | --- | ---: | --- |
| `amd-epyc-7j13` | [EPYC 7763](https://www.amd.com/en/products/processors/server/epyc/7003-series/amd-epyc-7763.html) | 280 W | Milan, 64 cores, 3.5 GHz boost. Base clock is 2.55 GHz on OCI E4 and 2.45 GHz on the 7763. |
| `amd-epyc-9j14` | [EPYC 9654](https://www.amd.com/en/products/processors/server/epyc/4th-generation-9004-and-8004-series/amd-epyc-9654.html) | 360 W | Genoa, 96 cores, 2.4 GHz base and 3.7 GHz boost on Standard E5. DenseIO E5 lists a higher 2.6 GHz base. |
| `amd-epyc-9j45` | [EPYC 9755](https://www.amd.com/en/products/processors/server/epyc/9005-series/amd-epyc-9755.html) | 500 W | Turin, 128 cores, 2.7 GHz base and 4.1 GHz boost on Standard E6. |

The manufacturing coefficients adapt Teads / Benjamin Davy's [article](https://medium.com/teads-engineering/building-an-aws-ec2-carbon-emissions-dataset-3f0fd76c98ac) and [Scope 3 Ratios spreadsheet](https://docs.google.com/spreadsheets/d/1DqYgQnEDLQVQm5acMAhLgHLD8xXCG9BIrk-_Nv6jF3k/edit), CC BY 4.0. Extensions and allocation rules are Digital4Better assumptions, not vendor-certified LCAs.

For reproducibility, see the [calculation inputs](https://github.com/digital4better/data/blob/main/sources/cloud/host-inputs.json), [calculator](https://github.com/digital4better/data/blob/main/scripts/cloud-hosts.ts) and [hardware source evidence](https://github.com/digital4better/data/blob/main/sources/cloud/host-evidence.json). The inputs drive recalculation; the evidence archive preserves dated observations and source hashes supporting the assumptions. Expected hardware values and their official references are checked by the [regression tests](https://github.com/digital4better/data/blob/main/site/tests/cloud-reference.test.cjs). Detailed before/after changes remain in [Git history](https://github.com/digital4better/data/commits/main/data/cloud).

## Limitations

Host profiles are calculation scenarios, **not a verified inventory of deployed servers**. Actual placement, reserved resources and heterogeneous workloads can differ. Unknown mappings use explicit fallbacks; Apple desktops use a rack-equivalent proxy. Neither is a measured product footprint. Interconnects and process-node differences are not separately modeled.

Regions may contain several datacenters; Scaleway uses availability-zone identifiers. Local/edge zones, private realms, quota-dependent availability and every customizable VM combination are not exhaustively covered. Maximum CPU and RAM for a flexible shape do not establish a default configuration.

Environmental disclosures have different dates and boundaries. Missing metrics remain absent; existing estimates are not re-certified by a hardware catalog update. Apply lifetime and usage-time allocation separately when calculating a period's footprint.

### Scaleway bounded review — 2026-11-18

The [environmental disclosures](https://www.scaleway.com/en/environmental-leadership/) and [Impact Report 2025](https://www-uploads.scaleway.com/Impact_Report2025_22ee3a8232.pdf), physical page 25, report annual **2024** values: DC5 (`fr-par-2`) PUE 1.25 and DC4 (`fr-par-3`) WUE 0.00002 L/kWh IT (definition on page 28). The historical zone/datacenter mappings are retained. Record-level `sources` and `fields` identify the evidence and assessed properties; other metrics on these records were not revalidated.

AMS3 (`nl-ams-3`) PUE conflicts (website 1.20, PDF 1.40); AMS1 (`nl-ams-1`) WUE conflicts (website 1.64, PDF 0.85 L/kWh IT). Historical PUE 1.20 and WUE 0.85 remain with `fields` marked `tentative`. The historical AMS3 WUE 0.22 was not revalidated. The PDF file was created/modified in February 2026, but the website revision date is unknown: document metadata cannot establish which 2024 table was revised last. Other environmental values are not revalidated by these corrections.

The [official Instance datasheet](https://raw.githubusercontent.com/scaleway/docs-content/main/pages/instances/reference-content/instances-datasheet.mdx) and [Paris-1 API](https://api.scaleway.com/instance/v1/zones/fr-par-1/products/servers) agree with existing vCPU/RAM values within the reviewed Instance scope. This is not a review of all historical products or every zone. GP1 CPU identity remains tentative: the datasheet says EPYC 7281 or equivalent, while the historical records retain 7401P. No host assumptions or embodied values are changed. Optional disks and maximum volume limits are not included local-storage capacity.
