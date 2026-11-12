# Digital4Better Open Data

Open reference data for understanding the environmental footprint of digital services, cloud infrastructure, electricity and AI.

Available as **JSON and CSV** for analysts, sustainability teams, researchers and product teams. These datasets are used, among other tools, by [fruggr](https://www.fruggr.io).

**[Explore the data](https://digital4better.github.io/data/)** · **[npm package](https://www.npmjs.com/package/@digital4better/data)** · **[Usage reference](./llms-full.txt)** · **[Contribute](https://github.com/digital4better/data/blob/main/CONTRIBUTING.md)**

## Find Your Dataset

| You want to... | Dataset |
| --- | --- |
| Compare AI models, capabilities and estimated sizes | [AI models](./data/ai/README.md) |
| Identify cloud regions, VM hardware and manufacturing impacts | [Cloud infrastructure](./data/cloud/README.md) |
| Convert electricity consumption into environmental impacts | [Electricity factors](./data/factor/README.md) |
| Explore electricity generation by geography and period | [Electricity mixes](./data/mix/README.md) |
| Compare electricity production technologies | [Energy impacts](./data/energy/README.md) |
| Estimate building energy impacts | [Facility factors](./data/facility/README.md) |
| Estimate employee travel impacts | [Transport factors](./data/transport/README.md) |
| Model equipment power and manufacturing impacts | [Equipment references](./data/equipment/README.md) |
| Match countries, subdivisions and estimated distances | [Geographic references](./data/country/README.md) |

## Highlights

### AI Models

Model characteristics, modalities, context windows and active/total parameters across vendors and cloud providers. Undisclosed properties are marked as estimates; historical models remain available.

**Sources:** official vendor documentation, cloud catalogs such as [AWS Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html), [Azure Foundry](https://ai.azure.com/catalog/models/) and [Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-partner-models), plus [Hugging Face](https://huggingface.co/), [LifeArchitect](https://lifearchitect.ai/models-table/), [ApXML](https://apxml.com/models/) and [EcoLogits](https://ecologits.ai/latest/methodology/proprietary_models/) where its estimates are retained.

See the [model guide](./data/ai/README.md) and [per-model provenance](./data/ai/provenance.md). Estimated sizes are not vendor disclosures.

### Cloud Infrastructure

Regions, VMs, CPUs, accelerators and modeled hosts for AWS, Azure, GCP, Oracle, OVHcloud and Scaleway. Use VM `embodied_allocated` for allocated manufacturing impact; the legacy VM `embodied` field is deprecated.

**Sources:** official catalogs from [AWS](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html), [Azure](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/overview), [GCP](https://docs.cloud.google.com/compute/docs/machine-resource), [Oracle](https://docs.oracle.com/en-us/iaas/Content/Compute/References/computeshapes.htm), [OVHcloud](https://www.ovhcloud.com/en/public-cloud/prices/) and [Scaleway](https://www.scaleway.com/en/docs/instances/reference-content/instances-datasheet/), together with manufacturer specifications.

The [cloud guide](./data/cloud/README.md) documents environmental disclosures, capacity units, host allocation and provider-specific assumptions.

### Electricity Mix And Impact Factors

Monthly and yearly data at world, continent, country and subdivision levels, with full-mix and renewable-only variants.

**Sources:** [Ember](https://ember-energy.org/data/yearly-electricity-data/), [UNECE life-cycle assessments](https://unece.org/sed/documents/2021/10/reports/life-cycle-assessment-electricity-generation-options) and [academic literature](https://www.sciencedirect.com/science/article/pii/S0196890422008159#b0530).

Read the [mix guide](./data/mix/README.md) for scenarios and historical references, and the [factor guide](./data/factor/README.md) for per-kWh calculations.

### Facility And Transport

[Facility factors](./data/facility/README.md) cover building electricity and fuels, with explicit lower/higher calorific bases. [Transport factors](./data/transport/README.md) cover travel modes, including aviation, rail, road and active mobility.

**Sources:** [ADEME Base Carbone](https://base-empreinte.ademe.fr/), [ADEME Impact CO2](https://impactco2.fr/outils/transport) and the repository's electricity factors. Transport excludes vehicle construction and retains aviation radiative forcing. Missing European equivalents are not replaced silently with French factors.

### Equipment Reference Data

[Equipment references](./data/equipment/README.md) support simplified power and manufacturing-impact calculations. [Geographic references](./data/country/README.md) support location matching and approximate distance calculations.

**Sources:** Digital4Better modeling inputs, life-cycle assessment literature and [ISO country/subdivision conventions](https://www.iso.org/iso-3166-country-codes.html). Distances and equipment factors are reference estimates, not measurements of a specific deployment. See the [usage reference](./llms-full.txt) for their interpretation.

## Use the Data Safely

Choose JSON for structured data or CSV for spreadsheets and BI tools. Download files from the website or use a versioned npm package for reproducible calculations.

| Check | Why it matters |
| --- | --- |
| Units | Electricity/facility factors are per kWh; transport uses passenger-km or vehicle-km. Cloud manufacturing impact is in tCO2e, not kgCO2e. |
| Scope and period | A factor may describe a country, a source year, a modeled host or a complete lifecycle. These are not interchangeable. |
| Missing values | An absent field, `null` or an empty CSV cell means unavailable, not zero. Explicit zeros must be read with the collection's conventions. |
| Estimates and sources | Public specifications, observed configurations and calculation hypotheses have different evidential strength. |
| Availability | Historical cloud offers and AI models remain listed after retirement. |

Each dataset guide documents its files, columns, units, sources and limitations. The [usage reference](./llms-full.txt) explains cross-dataset selection and provides examples. Source observation dates differ from file modification and package release dates.

## Documentation for AI Assistants

Use [llms.txt](./llms.txt) as the short package index and [llms-full.txt](./llms-full.txt) as the offline reference. The website provides its own [index](https://digital4better.github.io/data/llms.txt) and [full reference](https://digital4better.github.io/data/llms-full.txt).

## Contributing and License

Corrections and documented sources are welcome: see [CONTRIBUTING.md](https://github.com/digital4better/data/blob/main/CONTRIBUTING.md).

Published under the [Open Database License (ODbL)](./LICENCE). Preserve upstream attribution and notices where applicable.

[Digital4Better](https://digital4better.com) · [fruggr](https://www.fruggr.io) · [GitHub](https://github.com/digital4better/data)
