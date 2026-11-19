# Cloud provenance

The [cloud guide](./README.md) defines the schema and units. Most hardware specifications can be traced directly through each record’s `sources`. The notes below explain comparisons, conversions and limitations that affect how particular values can be used.

## Hardware estimates and conventions

For the three Oracle CPUs below, `fields.tdp` is `estimated`. Each value uses the AMD catalog processor’s default watts per socket. Oracle’s configured power limit is unknown.

| Oracle CPU | AMD reference | Comparison |
| --- | --- | --- |
| `amd-epyc-7j13` | EPYC 7763 | Both have 64 Milan cores and boost to 3.5 GHz. Standard E4 runs at 2.55 GHz base versus 2.45 GHz for the 7763. |
| `amd-epyc-9j14` | EPYC 9654 | Both have 96 Genoa cores. Standard E5 matches at 2.4 GHz base and 3.7 GHz boost. DenseIO E5 has a 2.6 GHz base. |
| `amd-epyc-9j45` | EPYC 9755 | Both have 128 Turin cores, a 2.7 GHz base and a 4.1 GHz boost. |

- The M3 Ultra process follows its two M3 Max dies. For `amd-epyc-9555p`, the SKU table identifies the Zen 5 compute die, which differs from the Zen 5c variant. For `nvidia-rtx-pro-4500-blackwell-server`, the supported-GPU list identifies GB203 and the architecture paper provides its process node.
- `intel-xeon-6985pc` uses the two SMBIOS Type 4 entries for the GCP C4 bare-metal machine. Each socket reports 72 physical cores. For `intel-xeon-8592plus` and `intel-xeon-sapphire-rapids`, the numeric process entry follows the 10 nm convention for Intel 7.
- `amd-radeon-mi355x` uses the compute die’s 3 nm node. The module also includes 6 nm silicon. For `nvidia-blackwell-b200-192`, the power envelope is the configurable maximum per GPU in Azure’s GB200 NVL72 system. The HGX B200 uses a different limit.
- The `nvidia-rubin` core count uses 224 streaming multiprocessors × 128 CUDA cores. The `amd-epyc-9004` family entry identifies a compute process shared across SKUs with different core counts and TDPs.

## Processor evidence boundaries

- Oracle submitted a BM.GPU.MI355X.8 system with two 64-core AMD EPYC 9575F processors and eight MI355X accelerators to MLPerf Inference. Its default 400 W TDP and 4 nm compute node are estimates for the generic 64-core catalog ID in this configuration. For BM.Standard4.Ax.120, Oracle's MLPerf submission identifies a single 120-core Xeon 6987P-C. Its TDP estimate uses the 6979P's default 500 W. Their base/maximum clocks are 2.2/3.2 GHz and 2.1/3.9 GHz respectively.
- For the GCP 72-core Xeon 6985P-C, 550 W is the CPU-Z TDP reported on a matching processor outside Google Cloud. For Oracle's AmpereOne A160-30, 400 W is the distributor's rating for the named 160-core SKU. The cloud operators' actual configured limits are unknown.
- The Rome 7542 and 7742 silicon totals use four and eight compute dies respectively, at 74 mm² and 3.8 billion transistors each. Milan 7J13 uses eight compute dies at 81 mm² and 4.15 billion transistors each. Genoa 9J14 uses twelve at an estimated 6.57 billion transistors each. All four estimates exclude the I/O die. Historical entries may use other boundaries.
- Apple area and transistor counts describe the entire SoC. M3 Ultra area is the sum of two M3 Max dies. M4 Pro and M4 Max transistor counts use High Yield's rounded estimates.

## Capacity unit exceptions

Azure GB RAM exceptions include Dnsv6, Dnlsv6, Ensv6, HBv5, Esv7, Ebsv6, Ebdsv6, Ecasv6 and Ecadsv6. Local storage is GB for Lsv4, Lasv4 and Lasv5/Laosv5; GiB for Ddsv7, Dldsv7, Daldsv7, Dcadsv6, Famdsv7 and Faldsv7.

## Regional environmental references

| Provider | Source and interpretation |
| --- | --- |
| AWS | [Regional PUE/WUE disclosures](https://sustainability.aboutamazon.com/products-services/aws-cloud); current regional measurements are used when published. The older CSV remains a historical reference. REF remains zero by convention. |
| Azure | [Datacenter efficiency disclosures](https://datacenters.microsoft.com/sustainability/efficiency/) and regional fact sheets, including curated historical values whose original PDFs may no longer be retrievable. |
| GCP | [Regional carbon data](https://cloud.google.com/sustainability/region-carbon); CFE is used as the REF proxy. Previously derived water values remain pending clearer regional disclosures. |
| Oracle | [OCI environmental reporting](https://www.oracle.com/a/ocom/docs/corporate/citizenship/clean-cloud-oci.pdf); renewable matching is distinct from physical grid emissions. Uniform PUE 1.07 and provisional WUE zero remain reference assumptions. |
| OVHcloud | [FY25 environmental KPIs](https://www.ovhcloud.com/sites/default/files/external_files/kpis_fy25.pdf). |
| Scaleway | [Calculation reference](https://www.scaleway.com/en/docs/environmental-footprint/additional-content/calculation-values-reference/) and datacenter impact reports. |

### Reviewed regional periods and limits

AWS directly reported regional PUE/WUE values use calendar 2025 where available; absent disclosures retain their earlier reference or estimate. Aggregate-derived values in the table below still refer to 2024. Thailand (`ap-southeast-7`) now uses regional 2025 PUE 1.38; its WUE remains the earlier Asia-Pacific aggregate estimate. The source may revise earlier columns, so the retained CSV is not the latest annual feed.

Google regional `ref` uses the published 2025 CFE percentage divided by 100. No new campus-to-region PUE or water mapping is inferred from the separate datacenter efficiency tables. `asia-southeast3` still lacks a regional CFE disclosure.

Oracle `ref=1` for the 43 matched commercial-region keys represents FY2026 annual renewable electricity matching (June 2025–May 2026), not carbon-free supply every hour or zero physical grid emissions. `ap-kulai-2` and `af-casablanca-1` retain their historical zero placeholders: the former is key JBP while the report lists a different Kulai key FYV; the latter is absent from the regional table. Neither zero is a measured renewable share.

### Reviewed VM and hardware evidence

Azure Cobalt 200 families `dpsv7`, `dpdsv7`, `dplsv7`, `dpldsv7`, `epsv7`, `epdsv7`, `mpsv4`, `mpdsv4` and `lpsv5` use the published sizes, not a Cartesian product. Family host envelopes use the largest observed vCPU, RAM and local-storage limits as an explicit scenario, with one assumed socket and modeled physical disks. These are not installed host inventories. Local disk totals are count × per-disk size; storage is GiB for the D/E/M variants and GB for Lpsv5. Cobalt 200 uses 132 Arm Neoverse V3 cores per SoC on TSMC’s 3 nm process. Its die area and TDP remain unknown.

Other added Azure sizes use the maximum allocated result among compatible existing profiles of the same family; where none fits, a dedicated-equivalent scenario is allocated at 100%, with the socket and storage assumptions recorded in the input profile. The two M-family additions without an exact CPU SKU keep that field absent rather than assigning a processor from a generation label.

GCP `a5x-highgpu-4g-metal` exposes 176 vCPUs, 1,440 GB RAM, four 12,000 GiB local SSDs and four Rubin GPUs. Its two Vera sockets each have 88 physical cores and support 176 hardware threads; those hardware specifications do not change the published guest vCPU count. Each Rubin GPU has 288 GB HBM4. The bare-metal impact scenario allocates the full envelope once and excludes additional interconnect hardware. Capacity requires coordination with the provider; inclusion does not guarantee an immediately allocatable instance.

The corrected GCP M4 RAM values (31/62/124 GB for `m4-hypermem-2/-4/-8`) change placement counts and `embodied_allocated`; the historical `embodied` values are pinned in the calculator inputs. Azure `nd96isr-h200-v5` RAM is 1,850 GiB; its existing physical host scenario is retained.

AWS `m1-medium`, `r3-large` and `t1-micro` RAM values remain historical and `tentative`: the [previous-generation product page](https://aws.amazon.com/ec2/previous-generation/) and [EC2 specification table](https://docs.aws.amazon.com/ec2/latest/instancetypes/pg.html) disagree or differ in rounding. No RAM or impact change is inferred from that disagreement.

### Regional estimate scope

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

### Scaleway bounded review — 2026-11-18

The [environmental disclosures](https://www.scaleway.com/en/environmental-leadership/) and [Impact Report 2025](https://www-uploads.scaleway.com/Impact_Report2025_22ee3a8232.pdf), physical page 25, report annual **2024** values: DC5 (`fr-par-2`) PUE 1.25 and DC4 (`fr-par-3`) WUE 0.00002 L/kWh IT (definition on page 28). The historical zone/datacenter mappings are retained. Record-level `sources` and `fields` identify the evidence and assessed properties; other metrics on these records were not revalidated.

AMS3 (`nl-ams-3`) PUE conflicts (website 1.20, PDF 1.40); AMS1 (`nl-ams-1`) WUE conflicts (website 1.64, PDF 0.85 L/kWh IT). Historical PUE 1.20 and WUE 0.85 remain with `fields` marked `tentative`. The historical AMS3 WUE 0.22 was not revalidated. The PDF file was created/modified in February 2026, but the website revision date is unknown: document metadata cannot establish which 2024 table was revised last. Other environmental values are not revalidated by these corrections.

The [official Instance datasheet](https://raw.githubusercontent.com/scaleway/docs-content/main/pages/instances/reference-content/instances-datasheet.mdx) and [Paris-1 API](https://api.scaleway.com/instance/v1/zones/fr-par-1/products/servers) agree with existing vCPU/RAM values within the reviewed Instance scope. This is not a review of all historical products or every zone. GP1 CPU identity remains tentative: the datasheet says EPYC 7281 or equivalent, while the historical records retain 7401P. No host assumptions or embodied values are changed. Optional disks and maximum volume limits are not included local-storage capacity.
