# Cloud Reference Notes

These catalogs retain historical regions and machine types, including retired offers. An entry is a reference configuration, not a promise of current capacity or availability in every region. A cloud region can contain several datacenters; Scaleway entries use availability-zone identifiers.

## November 2026 Refresh

Reviewed on **2026-11-10**, against the official public catalogs below. This README records sources, capacity units, limitations and approved corrections; the Git history identifies individual additions and changes.

| Provider | Machine additions | Region/zone additions | Main coverage |
| --- | ---: | ---: | --- |
| AWS | 241 | 0 | M/C/R9g, Intel network/EBS variants, T8i, G7 and missing sizes in existing families |
| Azure | 316 | 1 | Intel v7, AMD variants, confidential VMs, storage, GPU and memory families; Southeast Asia 3 |
| GCP | 203 | 3 | N4A/N4D, C4N, M4/M4N, X5, Z4M/Z4D and fractional G4; Bangkok, Stockholm and Queretaro |
| Oracle | 6 | 0 | Fixed bare-metal Ax shapes, RTX PRO and B300 |
| OVHcloud | 11 | 0 | H200 and missing historical T1/T2 GPU sizes |
| Scaleway | 80 | 3 | BASIC2/3, STANDARD2/3, COMPUTE3, MEMORY3, POP2 intermediate sizes and B300; Milan zones |

No existing identifiers were removed or renamed. Existing records were left unchanged except these reviewed RAM corrections:

| Provider / machine | Previous RAM | Corrected RAM | Official evidence |
| --- | ---: | ---: | --- |
| AWS `d2.8xlarge` | 36 | 244 GiB | [EC2 storage specifications](https://docs.aws.amazon.com/ec2/latest/instancetypes/so.html) |
| OVHcloud `a10-45` | 45 | 42 GB | [Public Cloud prices](https://www.ovhcloud.com/en/public-cloud/prices/) |
| OVHcloud `a10-90` | 90 | 85 GB | [Public Cloud prices](https://www.ovhcloud.com/en/public-cloud/prices/) |
| OVHcloud `a10-180` | 180 | 170 GB | [Public Cloud prices](https://www.ovhcloud.com/en/public-cloud/prices/) |

## Verified Values And Missing Fields

- Hardware specifications come from provider/manufacturer documents or explicitly identified observations below. Unknown specifications and environmental indicators remain absent, not zero. Manufacturing-impact fields are modeled exceptions: the allocation method, legacy compatibility and fallback profiles are documented below. CSV exports represent omissions as empty cells.
- CPU and GPU descriptions may be available in the linked provider specifications even when a matching hardware identifier is not available in the shared catalog. Do not substitute a different chip merely because its generation is similar.
- Capacity numbers retain the provider's published scale, as existing catalogs do. **GB and GiB are not interchangeable**: consult the unit table below for this refresh. TB and TiB totals are reduced to GB and GiB respectively; historical values were not globally converted.
- `ssd`/`hdd` describe included local storage, not the maximum attachable network disks. Optional disk capacity is not assumed to be installed. Azure per-device quantities are multiplied only where the provider's table definitions establish that interpretation; ambiguous totals remain absent.
- Fractional accelerator values, such as `0.125`, represent a documented GPU slice, not that many physical boards. Bare-metal configurations have `virtual: false`.
- The new regions/zones have verified identities and city/country locations, but no newly inferred coordinates. Without coordinates they remain usable in tables/downloads but are not plotted on the map.
- New GCP regions Stockholm and Queretaro have the regional CFE fraction published by Google. Bangkok has no verified value in that table. PUE/WUE and Scaleway Milan sustainability values remain absent where no regional disclosure was verified.

## Host Profiles And Instance Manufacturing Impact

Each provider has a separate host catalog and flat CSV:

| Provider | JSON | CSV |
| --- | --- | --- |
| aws | [aws-hosts.json](./aws-hosts.json) | [aws-hosts.csv](./aws-hosts.csv) |
| azure | [azure-hosts.json](./azure-hosts.json) | [azure-hosts.csv](./azure-hosts.csv) |
| gcp | [gcp-hosts.json](./gcp-hosts.json) | [gcp-hosts.csv](./gcp-hosts.csv) |
| oracle | [oracle-hosts.json](./oracle-hosts.json) | [oracle-hosts.csv](./oracle-hosts.csv) |
| ovhcloud | [ovhcloud-hosts.json](./ovhcloud-hosts.json) | [ovhcloud-hosts.csv](./ovhcloud-hosts.csv) |
| scaleway | [scaleway-hosts.json](./scaleway-hosts.json) | [scaleway-hosts.csv](./scaleway-hosts.csv) |

Machine fields include `id`, `name`, `family`, `category`, `vcpus`, `ocpus`, `memory`, `ssd`, `hdd`, `cpu`, `accelerator`, `accelerators`, `virtual`, `embodied`, `embodied_allocated`, `host`, `host_share` and `host_instances`. Some catalogs include bare metal or managed-service references. Native GB/GiB capacity conventions are retained, not globally converted. Optional network disks are excluded. Fractional accelerator quantities describe instance allocations, not fractional physical boards.

**Deprecated VM field:** `embodied` retains previously published values unchanged. For records missing that field at migration, it equals the new `embodied_allocated`. Its historical scope is heterogeneous; do not assume it is consistently host-level or VM-level and do not use it as the denominator for allocation. Both impact fields are populated for every instance. New calculations should use `embodied_allocated`, in tCO2e per instance reservation over the modeled host lifetime, before any time amortization. Do not apply the host share twice.

`host` references an `id` in the same provider's `<provider>-hosts.json`. Host `embodied` is NOT deprecated: it is the total modeled physical-host manufacturing impact in tCO2e. `host_share` is the fraction of that impact assigned to the instance; `host_instances` is the modeled maximum number of identical instances per host. The relationship is `embodied_allocated = host.embodied * host_share` (rounding tolerance 1e-10 tCO2e), and `host_share = 1 / host_instances`. Bare metal and explicit dedicated-equivalent fallbacks use one.

Host profiles contain `id`, `provider`, `name`, `basis`, `method`, `vcpus`, `memory`, `sockets`, optional `cpu` references, `ssd_count`, `hdd_count`, optional local `ssd_capacity`/`hdd_capacity`, optional `accelerator`, `accelerators`, `accelerator_memory`, `embodied`, `sources` and `assumptions`. Counts refer to modeled physical components; capacities retain the associated provider's numerical convention. `accelerator_memory` is GB per modeled accelerator. These are calculation profiles, not a verified physical-server inventory. CPU lists are alternatives, not socket counts. JSON sources/assumptions are arrays; flat CSV joins them with ` | `. Other optional hardware fields can still be absent.

### Assumption Codes

`assumptions` is an array of enum codes, not free text. Numeric choices live in the host fields; evidence URLs live in `sources`. Several codes can apply to one profile. Profiles and their IDs describe modeled hardware, not a methodology author.

| Code | Meaning |
| --- | --- |
| `historical-host` | Historical source configuration, not inferred from the previous impact. |
| `cpu-proxy` | Instance CPU references are model inputs, not verified host inventory. |
| `max-impact` | Highest allocated result among compatible modeled candidates, not a proven upper bound. |
| `published-sockets` | Socket count from a compatible dedicated-host family. |
| `inferred-sockets` | Sockets inferred from CPU capacity, with architecture defaults when unknown. |
| `baremetal-proxy` | Bare-metal resources proxy the host; placement and reserved capacity remain unknown. |
| `family-proxy` | Compatible family configuration proxies the host; actual deployment is unverified. |
| `largest-size-vcpu` | Largest matching SKU supplies the vCPU envelope, without another SMT multiplier. |
| `catalog-proxy` | Largest matching SKU proxies the host, using exposed RAM and inferred components. |
| `dedicated-host-proxy` | Published dedicated-host capacity proxies ordinary VM hosting. |
| `sole-tenant-proxy` | Published sole-tenant capacity and sockets proxy ordinary VM hosting. |
| `dedicated-fallback` | Unknown mapping: dedicated-equivalent envelope allocated at 100%. |
| `desktop-fallback` | Rack-equivalent desktop proxy, not a product LCA or proven upper bound. |
| `one-ssd` | One physical local SSD assumed; guest partitions are not physical drives. |
| `one-hdd` | One physical local HDD assumed; actual count is unknown. |
| `storage-proxy` | Physical drive count is modeled, not the guest partition count. |
| `non-gpu-proxy` | ASIC/FPGA uses GPU board/memory coefficients and board-equivalent quantities. |
| `accelerator-memory-default` | Unknown accelerator memory uses a 16 GB placeholder. |
| `gpu-host-proxy` | Full GPU-family configuration proxies the host; numeric assumptions are in its fields. |
| `hbm-ram-proxy` | HBM uses the ordinary RAM coefficient. |
| `installed-ram-proxy` | Installed RAM is modeled from the family envelope, not guest-available RAM. |
| `storage-pools` | Diskless and local-storage variants use separate modeled host pools. |
| `cpu-generation-proxy` | Host envelope is specific to the modeled CPU generation. |
| `interconnect-excluded` | Additional interconnect hardware is excluded. |
| `installed-vram` | Installed GPU memory replaces guest-usable memory. |
| `remote-storage-excluded` | Remote block storage is excluded from host manufacturing impact. |

`basis` summarizes the profile origin: `historical-source-reconstruction`, `family-bare-metal-proxy`, `documented-host-reconstruction`, `documented-host-proxy`, `explicit-refresh-scenario`, `catalog-family-scenario`, `dedicated-equivalent-fallback` or `desktop-rack-equivalent`. `method` identifies the calculation version (`d4b-host-v1`).

### Calculation And Allocation

The Digital4Better method `d4b-host-v1` adapts the historical Teads / Benjamin Davy coefficients: [original article](https://medium.com/teads-engineering/building-an-aws-ec2-carbon-emissions-dataset-3f0fd76c98ac), [Scope 3 Ratios spreadsheet](https://docs.google.com/spreadsheets/d/1DqYgQnEDLQVQm5acMAhLgHLD8xXCG9BIrk-_Nv6jF3k/edit), CC BY 4.0. It is our own method, not Teads certification. Host kgCO2e = 1000 + max(0, RAM - 16) * 1.3869 + (sockets - 1) * 100 + SSD count * 100 + HDD count * 50 + accelerator count * (150 + max(0, accelerator_memory - 16) * 1.3869). Divide by 1000 for tCO2e. The VRAM extension and use of the same board/memory proxy for ASIC/FPGA are explicit D4B approximations, not manufacturer LCAs. Unknown accelerator memory uses a documented 16 GB placeholder. No Boavizta factors or legacy embodied donors are used in the new calculation.

Allocation assumes homogeneous packing: N is the integer floor of the minimum host/instance CPU, RAM and accelerator capacity ratios, also constrained by known local storage capacity and documented placement limits. All residual host impact is divided by N. This is at least as high as proportional CPU/component allocation for the same profile; it does not assume an arbitrary 50% fleet occupancy. Among explicitly compatible candidate hosts, select the highest allocated impact, not the largest server independently. Real heterogeneous placement, utilization and idle-capacity attribution can differ.

Where mapping is unknown, managed services use an explicit dedicated-equivalent envelope with 100% attribution. Apple desktops use a documented rack-equivalent proxy, not an Apple LCA. Both are deliberately conservative policies, not proven physical upper bounds. Other family profiles may use a largest-size proxy or inferred sockets. Read each host's `basis` and `assumptions`; populated values do not mean verified hardware. The original coefficients are dated, and network/rack interconnects and process-node differences are not separately modeled. Apply lifetime/time allocation separately when computing a usage-period footprint.

For example, the modeled Azure Dsv6-Type1 host has 192 vCPUs, 1024 GiB RAM and two assumed sockets, giving 2.4979952 tCO2e. Microsoft's [Dsv6-Type1 packing table](https://learn.microsoft.com/en-us/azure/virtual-machines/dedicated-hosts/general-purpose-skus#dsv6) limits D2s_v6 to 32 instances: `host_instances = 32`, `host_share = 1/32`, and `embodied_allocated = 0.07806235` tCO2e. D16s_v6 has a limit of 12 and receives approximately 0.2081662667 tCO2e. The host includes two modeled sockets; the page does not independently confirm that socket count.

Host vCPU capacity means the allocatable envelope, not a guessed core count multiplied by SMT. The 16 GB RAM baseline remains inside the 1000 kg host base. Source GB/GiB numerical conventions are retained for continuity; they are not asserted equivalent units. A local virtual disk is not automatically a physical drive. Capacity limits are applied only where represented by a coherent profile, and missing hardware facts remain assumptions rather than new claims in the VM records.

### Provenance And Migration

The [pinned inputs](https://github.com/digital4better/data/blob/main/scripts/cloud-host-inputs.json) retain the pre-migration legacy values (including missing ones), the exact source host/placement mappings and reviewed profiles. The [calculator](https://github.com/digital4better/data/blob/main/scripts/cloud-hosts.cjs) reproduces all host and allocated impacts and refuses to alter a populated legacy value. Maintenance scripts and snapshots are outside the published datasets; the provider host JSON/CSV files are public reference datasets.

Legacy compatibility is intentional: `embodied` is deprecated only on VM records. Historical values remain unchanged even when they disagree with the new method; previously missing values receive the new allocated impact in both columns. Consumers must opt into `embodied_allocated`; this is not a silent change to every old calculation. The old gap-filling experiment and comparative reports remain historical analyses, not the active publishing method.

## Hardware Corrections Reviewed Before Embodied Recalculation

The November 11 review corrects documented hardware inputs without changing populated legacy `embodied` values. The [correction log](https://github.com/digital4better/data/blob/main/scripts/cloud-hardware-corrections.json) retains each identifier, previous value, replacement and official source outside the published datasets. Historical identifiers are retained, including retired VM sizes.

| Scope | Correction | Official evidence |
| --- | --- | --- |
| AWS P6e-GB200 | 4 GPUs rather than 36; local SSD capacity is 3 x 7500 GB rather than zero | [EC2 accelerated instances](https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html) |
| Azure M8ms / M16ms | RAM 218.75 / 437.5 GiB, without integer rounding | [M series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/memory-optimized/m-series) |
| Azure Mv3 high memory | M416ds/s_6 RAM 5696 GiB; M832ds_12 and M832ids_16 RAM 11400 / 15200 GiB (previously reversed) | [Mdsv3](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/memory-optimized/mdsv3-hm-series), [Msv3](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/memory-optimized/msv3-hm-series) |
| Azure NCasT4_v3 | EPYC 7V12 rather than 9V74; NC64 RAM 440 GiB; local SSD capacity follows each official size | [NCasT4_v3](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/gpu-accelerated/ncast4v3-series) |
| Azure NDm A100 / ND MI300X | RAM 1900 / 1850 GiB; A100 local SSD 6400 GiB | [NDm A100](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/gpu-accelerated/ndma100v4-series), [ND MI300X](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/gpu-accelerated/ndmi300xv5-series) |
| Azure NP | RAM 168 / 336 / 672 GiB and local SSD 736 / 1474 / 2948 GiB | [NP series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/fpga-accelerated/np-series) |
| Azure NV | NV6 / NV12 / NV24 allocate 0.5 / 1 / 2 of the catalog's 16 GB dual-GPU M60 boards | [NV series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/gpu-accelerated/nv-series) |
| GCP X4 | Xeon Platinum 8490H rather than 8477C | [CPU platforms](https://docs.cloud.google.com/compute/docs/cpu-platforms?hl=en) |

Native provider capacity units are retained; these are not GB/GiB conversions. Old AWS M1/R3/T1 RAM values are retained where the current documentation merely rounds them. The inconsistent storage-unit labels on the ND MI300X page are not used to silently change its SSD capacity. These targeted corrections do not certify that all remaining hardware or physical-host assumptions are verified. The new allocated field uses the explicit host profiles and limitations described above.

## CPU And Accelerator References

References added in this pass distinguish an exact SKU from a published processor family. Family-only entries (`amd-epyc-9004`, `intel-xeon-sapphire-rapids`, `intel-xeon-granite-rapids-ap`) intentionally omit unverified core counts, TDP and silicon characteristics. `intel-xeon-6-72c-oracle` describes the documented 72-core CPU class, not a guessed commercial SKU. CPU arrays list supported alternatives, not the number of installed sockets. New unknown hardware properties are omitted rather than populated with zero. Intel's marketed "Intel 3" process name is not converted into an asserted physical 3 nm feature size.

| Reference / mapping | Evidence and limits |
| --- | --- |
| AWS M/C/R9g -> `aws-graviton-5` | [EC2 general-purpose specifications](https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html), [Amazon Science](https://www.amazon.science/blog/graviton5s-improved-design-increases-speed-and-energy-efficiency-beyond-moores-law): 192 cores, Neoverse V3. |
| AWS Mac variants -> `apple-m3-ultra-28`, `apple-m4-max-16` | [EC2 specifications](https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html) identify the specific 28/16-core variants. No inferred TDP. |
| AWS M7i-flex / C7i-flex -> Xeon 8488C | [AWS general-purpose](https://aws.amazon.com/ec2/instance-types/general-purpose/) and [compute-optimized](https://aws.amazon.com/ec2/instance-types/compute-optimized/) pages. Recouped with [Vantage](https://instances.vantage.sh/aws/ec2/m7i-flex.xlarge) and [Cloud Mercato](https://pcr.cloud-mercato.com/providers/aws/flavors/m7i-flex.8xlarge). Trainium2's CPU remains at the published Sapphire Rapids family level. |
| Azure new Intel D/E v7 -> `intel-xeon-6973pc`; other new series -> 8573C / 8490H / published family | The per-series Microsoft specification links below identify the CPU. No retail SKU substituted for unpublished custom parts. |
| GCP C4 -> 6985P-C or 8581C | [Google CPU platforms](https://docs.cloud.google.com/compute/docs/cpu-platforms), [C4 configurations](https://docs.cloud.google.com/compute/docs/general-purpose-machines): local-SSD, bare-metal and 144/288-vCPU variants use Granite Rapids; other new C4 variants use Emerald Rapids. |
| GCP C4A / N4A -> Axion V2 / N3; N4D, Z4D, H4D and G4 -> EPYC 9B45 | [Google CPU platforms](https://docs.cloud.google.com/compute/docs/cpu-platforms). Existing `google-axion.platform` corrected from `neoverse n2` to `neoverse v2`; N4A gets a distinct `google-axion-n3` reference. Other historical Axion fields were not revalidated. |
| GCP M4/M4N, C4N, Z4M -> 8581C; Z3 -> 8481C; X5 -> 6788P | [Google CPU platforms](https://docs.cloud.google.com/compute/docs/cpu-platforms), [Intel 6788P](https://www.intel.com/content/www/us/en/products/sku/241837/intel-xeon-6788p-processor-336m-cache-2-00-ghz/specifications.html). |
| OCI Ax -> 6987P-C / AmpereOne M 192-36M; RTX PRO -> Xeon 6 72-core class | [Oracle shape specifications](https://docs.oracle.com/en-us/iaas/Content/Compute/References/computeshapes.htm). A4 Ax is not assigned the A06-36M used by non-Ax A4. |
| Scaleway generation 3 -> EPYC 9555P; generation 2 Arm -> M128-30; B300 -> Xeon 6776P | [Scaleway datasheet](https://www.scaleway.com/en/docs/instances/reference-content/instances-datasheet/), [AMD 9555P](https://www.amd.com/en/products/processors/server/epyc/9005-series/amd-epyc-9555p.html), [Intel 6776P](https://www.intel.com/content/www/us/en/products/sku/243691/intel-xeon-6776p-processor-336m-cache-2-30-ghz/specifications.html). |
| OVHcloud T1 -> Xeon Silver 4214; T2 / T2-LE -> Xeon Gold 6226R | Observed guest CPU models from Spare Cores: [T1-45](https://sparecores.com/server/ovh/t1-45), [T1-90](https://sparecores.com/server/ovh/t1-90), [T1-180](https://sparecores.com/server/ovh/t1-180), [T2-45](https://sparecores.com/server/ovh/t2-45), [T2-90](https://sparecores.com/server/ovh/t2-90), [T2-180](https://sparecores.com/server/ovh/t2-180), [LE-45](https://sparecores.com/server/ovh/t2-le-45), [LE-90](https://sparecores.com/server/ovh/t2-le-90), [LE-180](https://sparecores.com/server/ovh/t2-le-180). These are observed configurations, **not provider-wide guarantees**. Silicon specifications are not derived from guest vCPU counts. [Intel 4214](https://www.intel.com/content/www/us/en/products/sku/193385/intel-xeon-silver-4214-processor-16-5m-cache-2-20-ghz/specifications.html). |
| AWS G7 -> RTX PRO 4500 Blackwell Server; OVHcloud T2 -> V100S 32 GB | [AWS accelerated specifications](https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html), [NVIDIA RTX PRO 4500](https://www.nvidia.com/en-gb/data-center/rtx-pro-4500-blackwell-server-edition/), [OVHcloud prices](https://www.ovhcloud.com/en/public-cloud/prices/), [PNY V100S](https://www.pny.com/en-eu/tesla-v100s-32gb). V100S is not silently merged with V100. |
| Azure ND GB200 / GB300 -> B200 192 GB / B300 | [ND GB200](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/gpu-accelerated/nd-gb200-v6-series), [ND GB300](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/gpu-accelerated/nd-gb300-v6-series). GPU references are per GPU, not the whole Grace-Blackwell superchip. B200's 192 GB variant is distinct from the existing 180 GB reference. |

The H200 OVHcloud CPU and three Scaleway POP2-HN CPU references remain absent: the reviewed sources do not identify them reliably. Secondary catalogs can expose useful measured CPU names, but their storage counts, guest topology and availability can differ from official specifications; those fields were not copied wholesale.

### Capacity Units For This Refresh

These are the units printed by the sources for the newly added configurations, not a normalization of historical entries. An absent storage value remains unknown or not included; it does not imply zero.

| Provider | RAM | Included local storage, when recorded |
| --- | --- | --- |
| AWS | GiB | GB |
| Azure | GiB, except GB in Dnsv6, Dnlsv6, Ensv6, HBv5, Esv7, Ebsv6, Ebdsv6, Ecasv6 and Ecadsv6 tables | GB for Lsv4, Lasv4 and Lasv5/Laosv5; GiB for Ddsv7, Dldsv7, Daldsv7, Dcadsv6, Famdsv7 and Faldsv7 |
| GCP | GB | GiB |
| Oracle | GB | GB |
| OVHcloud | GB | GB |
| Scaleway | GiB | No local-storage quantities added |

## Scope And Follow-up

| Provider | Region source | Machine source |
| --- | --- | --- |
| AWS | [Available regions](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html) | [EC2 instance types](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html), all six current-generation specification tables |
| Azure | [Region list](https://learn.microsoft.com/en-us/azure/reliability/regions-list) | [Size families](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/overview), missing series and memory variants |
| GCP | [Regions and zones](https://docs.cloud.google.com/compute/docs/regions-zones?hl=en) | [Machine families](https://docs.cloud.google.com/compute/docs/machine-resource?hl=en), general, memory, storage, compute, network and GPU tables |
| Oracle | [Regions](https://docs.oracle.com/en-us/iaas/Content/General/Concepts/regions.htm) | [Compute shapes](https://docs.oracle.com/en-us/iaas/Content/Compute/References/computeshapes.htm) |
| OVHcloud | [Public Cloud availability](https://www.ovhcloud.com/en/public-cloud/regions-availability/) | [Public Cloud prices](https://www.ovhcloud.com/en/public-cloud/prices/) |
| Scaleway | [Region/zone identifiers](https://www.scaleway.com/en/developers/cli/config), [Milan opening](https://www.scaleway.com/en/docs/container-registry/) | [Instance datasheet](https://www.scaleway.com/en/docs/instances/reference-content/instances-datasheet/) |

<details>
<summary>Detailed specification sources used for this refresh</summary>

- **aws**: [gp](https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html), [co](https://docs.aws.amazon.com/ec2/latest/instancetypes/co.html), [mo](https://docs.aws.amazon.com/ec2/latest/instancetypes/mo.html), [so](https://docs.aws.amazon.com/ec2/latest/instancetypes/so.html), [ac](https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html).
- **azure**: [dcedsv6-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/dcedsv6-series), [dnsv6-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/memory-optimized/dnsv6-series), [dnlsv6-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/memory-optimized/dnlsv6-series), [ensv6-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/memory-optimized/ensv6-series), [laosv5-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/storage-optimized/laosv5-series), [lasv5-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/storage-optimized/lasv5-series), [lsv4-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/storage-optimized/lsv4-series), [lasv4-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/storage-optimized/lasv4-series), [laosv4-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/storage-optimized/laosv4-series), [nc-rtxpro6000-bse-v6-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/gpu-accelerated/nc-rtxpro6000-bse-v6-series), [nd-gb300-v6-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/gpu-accelerated/nd-gb300-v6-series), [nd-gb200-v6-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/gpu-accelerated/nd-gb200-v6-series), [hbv5-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/high-performance-compute/hbv5-series), [dsv7-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/dsv7-series), [ddsv7-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/ddsv7-series), [dlsv7-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/dlsv7-series), [dldsv7-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/dldsv7-series), [dalsv7-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/dalsv7-series), [daldsv7-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/daldsv7-series), [dcasv6-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/dcasv6-series), [dcadsv6-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/dcadsv6-series), [dcesv6-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/dcesv6-series), [famsv7-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/compute-optimized/famsv7-series), [famdsv7-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/compute-optimized/famdsv7-series), [falsv7-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/compute-optimized/falsv7-series), [faldsv7-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/compute-optimized/faldsv7-series), [esv7-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/memory-optimized/esv7-series), [edsv7-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/memory-optimized/edsv7-series), [ebsv6-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/memory-optimized/ebsv6-series), [ebdsv6-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/memory-optimized/ebdsv6-series), [ecasv6-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/memory-optimized/ecasv6-series), [ecadsv6-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/memory-optimized/ecadsv6-series), [msv3-mm-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/memory-optimized/msv3-mm-series), [mdsv3-mm-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/memory-optimized/mdsv3-mm-series), [msv3-hm-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/memory-optimized/msv3-hm-series), [mdsv3-hm-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/memory-optimized/mdsv3-hm-series), [mdsv3-vhm-series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/memory-optimized/mdsv3-vhm-series), [regions](https://learn.microsoft.com/en-us/azure/reliability/regions-list).
- **gcp**: [general-purpose](https://docs.cloud.google.com/compute/docs/general-purpose-machines?hl=en), [memory-optimized](https://docs.cloud.google.com/compute/docs/memory-optimized-machines?hl=en), [storage-optimized](https://docs.cloud.google.com/compute/docs/storage-optimized-machines?hl=en), [compute-optimized](https://docs.cloud.google.com/compute/docs/compute-optimized-machines?hl=en), [network-optimized](https://docs.cloud.google.com/compute/docs/network-optimized-machines?hl=en), [gpus](https://docs.cloud.google.com/compute/docs/accelerator-optimized-machines?hl=en), [regions](https://docs.cloud.google.com/compute/docs/regions-zones?hl=en), [carbon](https://cloud.google.com/sustainability/region-carbon).
- **scaleway**: [datasheet](https://www.scaleway.com/en/docs/instances/reference-content/instances-datasheet/), [zones](https://www.scaleway.com/en/developers/cli/config).
- **ovhcloud**: [prices](https://www.ovhcloud.com/en/public-cloud/prices/).
- **oracle**: [shapes](https://docs.oracle.com/en-us/iaas/Content/Compute/References/computeshapes.htm).

</details>

The AWS and OCI public region lists reviewed were already represented. Announced regions, every local/edge zone, private/government realms, quota-dependent availability and the Cartesian product of customizable sizes are not claimed to be exhaustive. Historical entries absent from today's sources remain in place.

New OCI flexible Ax shapes (`VM.Standard4.Ax.Flex`, `VM.Standard.E6.Ax.Flex`, `VM.Standard.A4.Ax.Flex`, `VM.DenseIO.E6.Ax.Flex`) need a separate configuration-selection decision. A shape's maximum CPU and maximum RAM do not establish a default configuration. They are not represented by invented fixed-size combinations in this refresh.

Existing sustainability values and modeling assumptions are retained, not re-certified by this machine inventory. The [AWS CSV](https://sustainability.aboutamazon.com/aws-wue-pue.csv) still exposes data through 2024; [Scaleway's calculation reference](https://www.scaleway.com/en/docs/environmental-footprint/additional-content/calculation-values-reference/) has no Milan rows. Google's [regional CFE table](https://cloud.google.com/sustainability/region-carbon) supports the two new fractions. A full PUE/WUE/REF reporting-year review, historical placeholder cleanup and hardware-factor recalculation require a separate reviewed audit.
