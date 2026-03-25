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
| [`data/equipment`](./data/equipment) | Equipment energy and embodied impact reference data | `energy.*`, `embodied.*` |

## Why This Repository Exists

These datasets are used to:

- estimate the environmental footprint of digital services
- compare cloud infrastructure options across providers and regions
- model electricity-related impacts by country, continent, or subdivision
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

The cloud referentials in [`data/cloud`](./data/cloud) provide structured information for major providers including AWS, Azure, GCP, OVHcloud, and Scaleway.

Typical use cases:

- mapping regions and datacenter footprints
- comparing VM families and hardware characteristics
- linking compute infrastructure to sustainability calculations

Main source families:

- provider region and infrastructure documentation from [AWS](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/), [Microsoft Azure](https://azure.microsoft.com/en-us/explore/global-infrastructure/geographies/), [Google Cloud](https://cloud.google.com/compute/docs/regions-zones), [OVHcloud](https://eco.ovhcloud.com/en-ie/our-commitments/global-infrastructure/), and [Scaleway](https://www.scaleway.com/en/docs/console/my-project/how-to/view-the-list-of-scaleway-regions-and-availability-zones/)
- manufacturer and hardware reference sources for CPUs and accelerators
- curated cross-checking from provider instance catalogs and infrastructure specification pages

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

## Quick Navigation

- AI models: [`data/ai/models.json`](./data/ai/models.json)
- Cloud regions: [`data/cloud`](./data/cloud)
- Country and region referentials: [`data/country`](./data/country)
- Energy impacts: [`data/energy/energy-impacts.json`](./data/energy/energy-impacts.json)
- Electricity mix: [`data/mix`](./data/mix)
- Electricity factors: [`data/factor`](./data/factor)
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
