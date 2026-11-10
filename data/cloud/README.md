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

- New entries contain only verified specifications. Unknown CPU or accelerator references, manufacturing impact (`embodied`), local-storage quantities and environmental indicators are omitted, not set to zero or copied from another offer. CSV exports represent these omissions as empty cells.
- CPU and GPU descriptions may be available in the linked provider specifications even when a matching hardware identifier is not available in the shared catalog. Do not substitute a different chip merely because its generation is similar.
- Capacity numbers retain the provider's published scale, as existing catalogs do. **GB and GiB are not interchangeable**: consult the unit table below for this refresh. TB and TiB totals are reduced to GB and GiB respectively; historical values were not globally converted.
- `ssd`/`hdd` describe included local storage, not the maximum attachable network disks. Optional disk capacity is not assumed to be installed. Azure per-device quantities are multiplied only where the provider's table definitions establish that interpretation; ambiguous totals remain absent.
- Fractional accelerator values, such as `0.125`, represent a documented GPU slice, not that many physical boards. Bare-metal configurations have `virtual: false`.
- The new regions/zones have verified identities and city/country locations, but no newly inferred coordinates. Without coordinates they remain usable in tables/downloads but are not plotted on the map.
- New GCP regions Stockholm and Queretaro have the regional CFE fraction published by Google. Bangkok has no verified value in that table. PUE/WUE and Scaleway Milan sustainability values remain absent where no regional disclosure was verified.

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
