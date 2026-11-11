# AI Model Reference Data

AI models across vendors and cloud providers, combining public specifications with explicitly marked estimates. Historical, preview and restricted-access models are retained.

## Files

| File | Purpose |
| --- | --- |
| [models.json](./models.json) · [models.csv](./models.csv) | Model characteristics and capabilities |
| [provenance.md](./provenance.md) | Parameter estimates, calculations and disagreements by model |
| [cloud-coverage.md](./cloud-coverage.md) | Observed cloud identifiers, mappings and coverage limits |

## File Structure and Units

JSON is an array of model objects; CSV has one row per model. Optional fields are omitted in JSON and empty in CSV. Lists use `|` in CSV. `parameters` is flattened into `parameters_active` and `parameters_total`; `pattern` and `providers` are JSON-only.

| JSON field | Type / unit | Meaning |
| --- | --- | --- |
| `name` | Text | Canonical model identifier. |
| `vendor` | Text | Model developer. |
| `open` | Boolean | Weights are available, not necessarily unrestricted. |
| `pattern` | Regex string | Recognizes model identifiers and variants. |
| `type` | Text | Main task, such as text, image, speech or embedding. |
| `architecture` | Text | Model architecture, such as dense or MoE. |
| `parameters.active` | Billions of parameters | Weights active during inference. |
| `parameters.total` | Billions of parameters | Total modeled weights; not an upper bound. |
| `context` | Tokens | Model context or documented input-token limit. |
| `corpus` | Billions of tokens for publisher-backed additions | Training corpus size; verify legacy units against the source. |
| `dimension` | Integer count | Embedding output dimensions. |
| `hidden_dimension` | Integer count | Core model hidden width, not embedding output size. |
| `input`, `output` | Arrays of strings | Supported modalities, such as text, image, audio or code. |
| `reasoning`, `tools` | Booleans | Reasoning and tool-use capabilities. |
| `providers` | Object of string arrays | Provider name mapped to model identifiers. |
| `sources` | Array of URLs | Evidence; each URL may support only some fields. |
| `estimated` | Array of field names | Properties not established by version-specific primary evidence. |

## Using the Data

Dense models conventionally use equal active and total counts. Analyzing images does not imply generating them: check both `input` and `output` rather than the main task alone.

Public `input`, `output`, `reasoning` and `tools` capabilities are not inferred from prices. Context uses the native model limit rather than a narrower hosting tier; media-only APIs can omit it when no meaningful token budget is exposed.

A populated parameter count **does not mean the vendor disclosed it**. Check `estimated` and the provenance table before treating a number as a measurement.

## Methodology

### Calculation Rules

1. Prefer checkpoint-specific counts or calculations from a published configuration.
2. Otherwise use an explicitly attributed estimate, unless stronger official evidence contradicts it.
3. For documented fine-tunes, consider the parent-size hypothesis. Reasoning effort, longer context or a Pro label do not by themselves imply more weights.
4. When ancestry is unknown, compare open-model analogues, family estimates and comparable prices; document the selected hypothesis and disagreements.

### Price Scenarios

```text
ratio = standard output price_target / standard output price_reference
active_price = reference_active * ratio
total_price = active_price / assumed_active_fraction
```

This is a sensitivity scenario, **not a physical scaling law**. Compare identical billing units, modalities and service classes. Prices also reflect margins, hardware, batching, quantization and inference effort; they cannot establish architecture or independently identify both active and total parameters.

### Combining Scenarios

Repeated estimates and scenarios sharing an anchor are not independent confirmations. Resolve architecture contradictions before combining sizes. When no scenario is preferred, a rounded geometric midpoint may supply an explicitly arbitrary operational value:

```text
selected = exp(mean(log(scenario_sizes)))
scenario_spread = max(scenario_sizes) / min(scenario_sizes)
```

This is not a statistical estimate or confidence interval. The provenance table explains when a family anchor or another selection is used instead.

For order-of-magnitude comparisons, `sqrt(total * active)` is an effective dense-size heuristic. It is not a physical parameter count and does not replace the active/total values.

## Sources and Attribution

| Information | Sources |
| --- | --- |
| Identity, capabilities, context | Official vendor documentation and model cards |
| Cloud availability | Official AWS Bedrock, Azure Foundry, Google Cloud, OVHcloud and Scaleway catalogs |
| Open-weight size and architecture | Publisher configurations, technical reports and [Hugging Face](https://huggingface.co/) cards |
| Proprietary size estimates | [LifeArchitect](https://lifearchitect.ai/models-table/) and its [methodology](https://lifearchitect.ai/models-table-methodology/) |
| Cross-checks | [ApXML](https://apxml.com/models), [models.dev](https://models.dev), [Ollama](https://ollama.com/library) and research publications |
| Retained inherited estimates | [EcoLogits](https://ecologits.ai/latest/methodology/proprietary_models/), with the derivation identified |

A source confirming context does not necessarily support parameter count. An open checkpoint used as an analogue does not reveal a closed model's hidden architecture.

Credit is retained for EcoLogits contributors, including Samuel Rince, wherever their estimates or family proxies are used. See the [attribution details](./provenance.md#ecologits-and-adaptations) and [upstream MPL-2.0 license](https://github.com/mlco2/ecologits/blob/c739e8d61f6a12a85864adb698ab85623fe70f3c/LICENSE). The repository's [ODbL license](https://opendatacommons.org/licenses/odbl/1-0/) does not replace upstream rights or notices.

## Limitations

- Parameter estimates can differ greatly between sources. They are calculation hypotheses, not precise measurements or environmental footprints.
- Component boundaries vary: counts may exclude encoders, projectors, safety models or routers. For example, DeepSeek-V4.1-Flash includes conditional memory in its estimated total; its active value describes decoding, not prefill.
- Historical `corpus` values have not all been re-audited; check their original source and units.
- Cloud coverage reflects inspected public catalogs, not every region, marketplace import or self-hosted checkpoint. A listed provider does not guarantee present access.
- Missing fields remain unavailable. Unresolved historical estimates stay identified in the provenance table rather than being relabeled as independently verified.
