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
| `sources`, `notes` | URL array / text | Evidence and interpretation limits (JSON-only). |

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

Region `pue` is a ratio, `wue` is L/kWh and `ref` is a fraction. Reporting boundaries differ: Google's CFE fraction is not interchangeable with renewable-energy matching. AWS `ref = 0` and Oracle `wue = 0` are dataset conventions, not verified absence of renewable energy or water use. See the [full reference](https://digital4better.github.io/data/llms-full.txt) for provider-specific rules.

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

The manufacturing coefficients adapt Teads / Benjamin Davy's [article](https://medium.com/teads-engineering/building-an-aws-ec2-carbon-emissions-dataset-3f0fd76c98ac) and [Scope 3 Ratios spreadsheet](https://docs.google.com/spreadsheets/d/1DqYgQnEDLQVQm5acMAhLgHLD8xXCG9BIrk-_Nv6jF3k/edit), CC BY 4.0. Extensions and allocation rules are Digital4Better assumptions, not vendor-certified LCAs.

For reproducibility, see the [calculation inputs](https://github.com/digital4better/data/blob/main/scripts/cloud-host-inputs.json), [calculator](https://github.com/digital4better/data/blob/main/scripts/cloud-hosts.cjs) and [hardware source evidence](https://github.com/digital4better/data/blob/main/scripts/cloud-embodied-audit-sources.json). Detailed changes remain in [Git history](https://github.com/digital4better/data/commits/main/data/cloud) and the [correction log](https://github.com/digital4better/data/blob/main/scripts/cloud-hardware-corrections.json).

## Limitations

Host profiles are calculation scenarios, **not a verified inventory of deployed servers**. Actual placement, reserved resources and heterogeneous workloads can differ. Unknown mappings use explicit fallbacks; Apple desktops use a rack-equivalent proxy. Neither is a measured product footprint. Interconnects and process-node differences are not separately modeled.

Regions may contain several datacenters; Scaleway uses availability-zone identifiers. Local/edge zones, private realms, quota-dependent availability and every customizable VM combination are not exhaustively covered. Maximum CPU and RAM for a flexible shape do not establish a default configuration.

Environmental disclosures have different dates and boundaries. Missing metrics remain absent; existing estimates are not re-certified by a hardware catalog update. Apply lifetime and usage-time allocation separately when calculating a period's footprint.
