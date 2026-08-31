# Digital4Better Open Data

Open datasets maintained by Digital4Better to describe the environmental footprint of digital services, cloud infrastructure, electricity systems, and AI models.

This repository is meant to be used as a data source, not as developer documentation. The main audience is analysts, sustainability teams, researchers, product teams, and anyone who needs reusable reference data in `JSON` or `CSV`.

These reference datasets are used, among other things, by [fruggr](https://www.fruggr.io), Digital4Better's platform for measuring and managing the environmental footprint of digital services.

## What You Can Find Here

The repository is organized as a set of reusable data collections:

| Collection | What it covers | Main files |
| --- | --- | --- |
| [`data/ai`](./data/ai) | AI model catalog across vendors and cloud providers | `models.json` |
| [`data/cloud`](./data/cloud) | Cloud regions, virtual machines, CPUs, accelerators | `*-regions.*`, `*-vms.*`, `cpus.*`, `accelerators.*` |
| [`data/country`](./data/country) | Countries, regions, continents, and distance referentials | `regions.*`, `countries.*`, `continents.*`, `*-distances.*` |
| [`data/energy`](./data/energy) | Environmental impacts of electricity production technologies | `energy-impacts.*` |
| [`data/mix`](./data/mix) | Electricity mix by geography and time period | `world-*`, `continent-*`, `country-*`, `subdivision-*` |
| [`data/factor`](./data/factor) | Electricity impact factors derived from energy mix data | `world-*`, `continent-*`, `country-*`, `subdivision-*` |
| [`data/facility`](./data/facility) | Building electricity and fuel impact factors | `factors.*` |
| [`data/transport`](./data/transport) | Passenger and vehicle transport impact factors | `factors.*` |
| [`data/equipment`](./data/equipment) | Equipment energy and embodied impact reference data | `energy.*`, `embodied.*` |

## Why This Repository Exists

These datasets are used to:

- estimate the environmental footprint of digital services
- compare cloud infrastructure options across providers and regions
- model electricity-related impacts by country, continent, or subdivision
- model building energy consumption and employee travel impacts
- enrich internal or public sustainability dashboards
- document AI models and their characteristics in a structured way

## Highlights

### AI Models

The AI catalog in [`data/ai/models.json`](./data/ai/models.json) documents model families from providers such as OpenAI, Anthropic, Google, Mistral, Meta, Qwen, DeepSeek, Amazon, Cohere, and others.

This makes it useful for market mapping, observatories, governance, and cloud/AI portfolio analysis.

Main source families:

- cloud provider catalogs such as [AWS Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html), [Azure AI Foundry](https://ai.azure.com/catalog/models/), [Google Cloud Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-partner-models), [OVHcloud AI Endpoints](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/), and [Scaleway Generative APIs](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/)
- official model vendor documentation such as [OpenAI](https://platform.openai.com/docs/models), [Anthropic](https://docs.anthropic.com/en/docs/about-claude/models/overview), [Mistral](https://docs.mistral.ai/getting-started/models/), [Qwen](https://qwen.ai/), and [DeepSeek](https://api-docs.deepseek.com/)
- model cards and open model hubs such as [Hugging Face](https://huggingface.co/)
- technical reports and synthesis sources such as [LifeArchitect](https://lifearchitect.ai/models-table/) and [ApXML Models](https://apxml.com/models/)

### Cloud Infrastructure

The cloud referentials in [`data/cloud`](./data/cloud) provide structured information for major providers including AWS, Azure, GCP, Oracle Cloud Infrastructure, OVHcloud, and Scaleway.

Typical use cases:

- mapping regions and datacenter footprints
- comparing VM families and hardware characteristics
- linking compute infrastructure to sustainability calculations

Main source families:

- provider region and infrastructure documentation from [AWS](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/), [Microsoft Azure](https://azure.microsoft.com/en-us/explore/global-infrastructure/geographies/), [Google Cloud](https://cloud.google.com/compute/docs/regions-zones), [Oracle Cloud Infrastructure](https://docs.oracle.com/en-us/iaas/Content/General/Concepts/regions.htm), [OVHcloud](https://eco.ovhcloud.com/en-ie/our-commitments/global-infrastructure/), and [Scaleway](https://www.scaleway.com/en/docs/console/my-project/how-to/view-the-list-of-scaleway-regions-and-availability-zones/)
- manufacturer and hardware reference sources for CPUs and accelerators
- provider sustainability disclosures used for `pue`, `wue`, and `ref`, including [AWS regional PUE/WUE](https://sustainability.aboutamazon.com/aws-wue-pue.csv), Microsoft regional fact sheets via [datacenters.microsoft.com](https://datacenters.microsoft.com/sustainability/efficiency/), [Google Cloud regional CFE%](https://cloud.google.com/sustainability/region-carbon), Oracle's [Corporate Citizenship Report](https://www.oracle.com/a/ocom/docs/corporate/citizenship/oracle-corp-citizenship-report-3941904.pdf), [OVHcloud FY25 KPIs](https://www.ovhcloud.com/sites/default/files/external_files/kpis_fy25.pdf) and [methodology note](https://corporate.ovhcloud.com/sites/default/files/2025-10/methodology_-_environmental_impact_tracker_fr.pdf), and Scaleway's [calculation reference values](https://www.scaleway.com/en/docs/environmental-footprint/additional-content/calculation-values-reference/) and [impact reports](https://www-uploads.scaleway.com/Impact_Report2024_A4_EN_9a7bd88445.pdf)

Current cloud assumptions kept in the datasets:

- `aws`: `pue` and `wue` come from the 2024 AWS regional CSV; `ref` stays at `0` because AWS public renewable matching disclosures are not used as a region-level factor in this referential
- `azure`: values come from Microsoft regional fact sheets, combining still-live PDFs with previously curated factsheet values for regions whose older PDFs are no longer publicly retrievable
- `gcp`: `ref` comes from regional `CFE%`; `wue` comes from previously derived values based on Google environmental reporting and is kept until Google publishes a clearer general regional water metric
- `oracle`: use a uniform `pue = 1.07` and provisional `wue = 0` until OCI publishes region-level metrics
- `ovhcloud`: follow FY25 KPI values for `pue`, `wue`, and `ref`
- `scaleway`: values come from documented datacenter figures, completed where needed with the provider's impact reports

### Electricity Mix And Impact Factors

The datasets in [`data/mix`](./data/mix) and [`data/factor`](./data/factor) help translate electricity consumption into environmental impacts.

They are available at several levels:

- world
- continent
- country
- subdivision

And across different time granularities:

- yearly
- monthly

Green-only variants are also available through files ending with `-green`.

Main source families:

- electricity generation data from [Ember monthly electricity data](https://ember-climate.org/data-catalogue/monthly-electricity-data/) and [Ember yearly electricity data](https://ember-climate.org/data-catalogue/yearly-electricity-data/)
- impact factors built from lifecycle assessment literature, including [UNECE 2021 - Life cycle assessment of electricity generation options](https://unece.org/sed/documents/2021/10/reports/life-cycle-assessment-electricity-generation-options) and related academic work such as [this Energy paper](https://www.sciencedirect.com/science/article/pii/S0196890422008159#b0530)

### Facility Impact Factors

The annual factors in [`data/facility`](./data/facility) cover purchased building energy:

- electricity for France and Europe, retaining all nine available environmental indicators
- natural gas, heating oil, propane, and wood pellets when a verified ADEME factor is available
- explicit lower (`-pci`) or higher (`-pcs`) calorific value bases in fuel factor identifiers

Electricity values are synchronized with the annual factors already generated in [`data/factor`](./data/factor). Fuel values come from valid total records in the ADEME Base Carbone. District heating and cooling are not included because their factors depend on the local network.

### Transport Impact Factors

The annual factors in [`data/transport`](./data/transport) provide a French catalogue for employee travel, including:

- four aviation distance bands
- national and regional rail, coach, bus, tram, and metro
- petrol, diesel, electric, hybrid, and plug-in hybrid cars
- thermal and electric scooters, motorcycles, walking, and bicycles

Collective and active modes are expressed per passenger-kilometre (`pkm`), while individual motor vehicles are expressed per vehicle-kilometre (`vkm`). Values come from the ADEME Impact CO2 transport API without vehicle construction; aviation retains radiative forcing. No European transport fallback is published when an equivalent factor cannot be verified.

### Geography And Distances

The datasets in [`data/country`](./data/country) provide geographic referentials used to map countries, continents, subdivisions, and estimated network distances.

Typical use cases:

- geographic normalization
- country and subdivision mapping
- rough estimation of distances between users, countries, regions, and datacenters

Main source families:

- ISO country and subdivision standards
- internally maintained geographic referentials used to derive administrative mappings and distance approximations

### Equipment Reference Data

The datasets in [`data/equipment`](./data/equipment) provide reference values for embodied impacts and operational energy of common digital equipment categories.

Typical use cases:

- footprint modeling at equipment level
- simplified lifecycle modeling for digital services
- comparative analysis of device or infrastructure categories

Main source families:

- Digital4Better internal modeling inputs
- lifecycle assessment literature and equipment reference datasets used for sustainability calculations

## Formats

Most collections are published in both formats:

- `JSON` for structured or nested data
- `CSV` for tabular exploration, spreadsheets, and BI tools

If a collection is only available in one format, it is usually because that format is the most natural one for the data structure.

## Units And Environmental Impact Indicators

Impact values combine an indicator-specific unit with a functional unit. For example, a `gwp` value in a transport record whose `unit` is `pkm` is expressed in `kg CO2 eq/pkm`. The `unit` field is therefore the denominator of every impact present in that record, not the unit of the impact indicator itself.

### Functional units by collection

| Files | Functional unit | Meaning |
| --- | --- | --- |
| [`data/energy/energy-impacts.*`](./data/energy) | `kWh` | Impact per kilowatt-hour of electricity generated by the specified technology. The fixed functional unit is not repeated in each record. |
| [`data/factor/*`](./data/factor) | `kWh` | Impact per kilowatt-hour of electricity consumed for the specified geography and period. The fixed functional unit is not repeated in each record. |
| [`data/facility/factors.*`](./data/facility) | `kWh` | Impact per kilowatt-hour of electricity or fuel energy. For fuels, `-pci` and `-pcs` in the factor ID identify the lower or higher calorific value basis. |
| [`data/transport/factors.*`](./data/transport) | `pkm` or `vkm` | Impact per passenger-kilometre for collective and active transport, or per vehicle-kilometre for individual motor vehicles. |
| [`data/equipment/embodied.*`](./data/equipment) | `/s` or `/GB/km` | Embodied impact allocated per second for equipment and virtual machines, or per gigabyte-kilometre for networks. |
| [`data/equipment/energy.*`](./data/equipment) | `W` or `Wh/GB/km` | Operational power for equipment and virtual machines, or electricity used per gigabyte-kilometre for networks. These fields are energy values, not environmental impacts. |

`pkm` means one passenger transported over one kilometre. `vkm` means one vehicle travelling one kilometre, independently of its passenger count. `GB/km` means one gigabyte transferred over one kilometre.

### Common impact indicators

The following indicators and native units are shared by the energy, electricity factor, facility, transport, and equipment collections. They follow the Environmental Footprint impact-category conventions documented by the [European Commission Joint Research Centre](https://publications.jrc.ec.europa.eu/repository/bitstream/JRC130796/JRC130796_01.pdf).

| Field | Environmental impact | Native unit |
| --- | --- | --- |
| `adpe` | Resource use, minerals and metals | `kg Sb eq` |
| `ap` | Acidification | `mol H+ eq` |
| `ctue` | Freshwater ecotoxicity | `CTUe` |
| `ctuh-c` | Human toxicity, cancer | `CTUh` |
| `ctuh-nc` | Human toxicity, non-cancer | `CTUh` |
| `gwp` | Climate change, global warming potential over 100 years | `kg CO2 eq` |
| `ir` | Ionising radiation, human health | `kBq U-235 eq` |
| `pm` | Particulate matter, human health | `disease incidence` |
| `wu` | Water use | `m3 world eq` |

The complete unit is obtained by dividing the native unit by the collection's functional unit. Examples include `kg CO2 eq/kWh`, `mol H+ eq/kWh`, `kg CO2 eq/pkm`, and `kg CO2 eq/vkm`.

An absent JSON property or an empty CSV cell means that the indicator is not available for that factor. It must not be interpreted as zero. An explicit numeric `0` is a known zero value.

### Additional equipment indicators

[`data/equipment/embodied.*`](./data/equipment) also contains the following indicators. Their native units are divided by the `unit` stored in the same equipment record.

| Field | Environmental impact | Native unit |
| --- | --- | --- |
| `adpf` | Resource use, fossils | `MJ` |
| `epf` | Eutrophication, freshwater | `kg P eq` |
| `epm` | Eutrophication, marine | `kg N eq` |
| `ept` | Eutrophication, terrestrial | `mol N eq` |
| `gwpb` | Climate change, biogenic | `kg CO2 eq` |
| `gwpt` | Climate change, total | `kg CO2 eq` |
| `gwplu` | Climate change, land use and land-use change | `kg CO2 eq` |
| `lu` | Land use, soil quality index | `Pt` (dimensionless) |
| `odp` | Ozone depletion | `kg CFC-11 eq` |
| `pocp` | Photochemical ozone formation | `kg NMVOC eq` |
| `mips` | Material input per service unit | `kg` |

### Cloud sustainability metrics

Cloud region files use additional operational indicators which are not life-cycle impact categories:

| Field | Metric | Unit |
| --- | --- | --- |
| `pue` | Power Usage Effectiveness | Ratio, dimensionless |
| `wue` | Water Usage Effectiveness | `L/kWh` |
| `ref` | Renewable Energy Factor | Ratio from `0` to `1` |

## Quick Navigation

- AI models: [`data/ai/models.json`](./data/ai/models.json)
- Cloud regions: [`data/cloud`](./data/cloud)
- Country and region referentials: [`data/country`](./data/country)
- Energy impacts: [`data/energy/energy-impacts.json`](./data/energy/energy-impacts.json)
- Electricity mix: [`data/mix`](./data/mix)
- Electricity factors: [`data/factor`](./data/factor)
- Facility factors: [`data/facility`](./data/facility)
- Transport factors: [`data/transport`](./data/transport)
- Equipment data: [`data/equipment`](./data/equipment)

## Notes On Data Quality

This repository aims to provide transparent and reusable reference data, but some values should be interpreted with care.

- Some fields are derived from public documentation, model cards, technical reports, or literature rather than official disclosures.
- Some collections include explicit uncertainty markers such as `estimated`.
- AI and cloud catalogs evolve quickly, so historical and legacy entries may coexist with current ones.
- Environmental factors are based on a mix of primary data, literature, and modeling assumptions.

When available, source URLs are kept directly in the data files themselves.

## Related Links

- GitHub repository: [digital4better/data](https://github.com/digital4better/data)
- Digital4Better: [digital4better.com](https://digital4better.com)
- fruggr: [fruggr.io](https://www.fruggr.io)
- Contributing guide: [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

This repository is published under the [ODC Open Database License (ODbL)](./LICENCE).
