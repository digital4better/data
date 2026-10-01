# AI Model Reference Data

This catalog combines public model specifications with explicitly marked estimates for undisclosed properties. It is used for reference and calculation: a populated parameter count is **not** evidence that a vendor has published its weights or architecture.

Audit date: **2026-10-01**. See the [model-by-model parameter provenance](./provenance.md) and the [cloud coverage inventory](./cloud-coverage.md). These documents distinguish published facts, third-party estimates, local hypotheses and unresolved historical values.

## Sources And Attribution

| Information | Preferred evidence |
| --- | --- |
| Identity, capabilities and context | Official vendor documentation and model cards |
| Cloud identifiers and availability | Official AWS Bedrock, Azure Foundry, Google Cloud, OVHcloud and Scaleway catalogs |
| Open-weight size and architecture | Publisher model cards, configurations and technical reports, including Hugging Face |
| Proprietary size estimates | Version-specific secondary estimates, especially [LifeArchitect](https://lifearchitect.ai/models-table/) and its [methodology](https://lifearchitect.ai/models-table-methodology/) |
| Additional cross-checks | [ApXML](https://apxml.com/models), [models.dev](https://models.dev), [Ollama](https://ollama.com/library), and research publications |
| Remaining inherited estimates | [EcoLogits](https://ecologits.ai/latest/methodology/proprietary_models/), with its original source and our transformation identified |

Sources support different fields. A vendor URL proving context does not prove a parameter count. A generic catalog URL is not sufficient numerical provenance. A Hugging Face proxy describes that open checkpoint, not the hidden architecture of the closed model being estimated.

Credit is retained for EcoLogits contributors, including Samuel Rince, wherever we keep estimates or family proxies derived from their work. The [provenance table](./provenance.md#ecologits-and-adaptations) links the pinned registry, calculation sheet and [upstream MPL-2.0 license](https://github.com/mlco2/ecologits/blob/c739e8d61f6a12a85864adb698ab85623fe70f3c/LICENSE). The project's [license](../../LICENSE) does not remove upstream rights or notices. Changing an attribution without changing the derivation would not make data independent.

## Reading Estimates

- `parameters.active` and `parameters.total` are in billions, not lower/upper bounds. Dense models conventionally use equal values; MoE active weights must not exceed total weights.
- `estimated` lists fields not established by a version-specific primary source. Public `input`, `output`, `reasoning` and `tools` capabilities are not filled using pricing assumptions.
- `sources` links public specifications, numerical anchors and, for local assumptions, this audit. An audit link explains a calculation; it is not external evidence that the calculated size is correct.
- `context` is a token capacity, never requests per minute, output image resolution, prompt characters or video seconds. Native limits take priority over a narrower hosting tier. Where only a text-input limit is exposed, the provenance notes that scope. Media-only APIs without a meaningful exposed token budget can omit it.
- `hidden_dimension` is the core model's hidden width. It is distinct from an embedding's output `dimension`; borrowed image-generator widths are marked estimated.
- Existing `corpus` values are retained, not comprehensively re-audited. Newly added training corpus counts use billions of tokens from publisher cards; older entries still require checking their original source and units.
- `open` means weights are available, not that a particular license permits every use. Dummy weights, API access and a public model card alone do not establish open-weight availability.
- `type` describes the main task; `input` and `output` describe modalities. The `audio` category covers music generation, distinct from `speech`. A model that analyzes an image does not thereby generate images.

## Calculation Rules

Use the following order, recording why a weaker hypothesis was retained or rejected:

1. Prefer official checkpoint-specific counts or calculations from a published configuration.
2. Otherwise retain an explicitly attributed external estimate, unless contradicted by stronger official architecture evidence.
3. For a documented fine-tune, compare a same-size parent hypothesis with alternatives. Specialization, longer context, reasoning effort or a Pro label do not by themselves imply more weights.
4. When ancestry is unknown, compare relevant open-model analogues, family-scale estimates and comparable prices. Identify assumptions separately from observations and keep large disagreements visible.

### Price Scenarios

For a reference model with an estimated active size `A_ref`, a deliberately simple scenario is:

```text
r = standard output price_target / standard output price_reference
A_price = A_ref * r
T_price = A_price / assumed_active_fraction
```

This is a sensitivity model, **not a physical scaling law**. Scaling the total count by the same ratio additionally assumes the active fraction is unchanged. Prices cannot identify whether a model is dense or MoE, nor independently determine both active and total weights.

Compare the same billing unit, modality and service class. Do not mix input/output prices, cached/batch/standard rates, dollars per character with dollars per token, or video seconds with text tokens. Even comparable rates contain margins, hardware costs, batching, quantization, utilization, routing and reasoning compute. Price dates and assumptions therefore belong in the provenance record.

For example, Codex Mini is an official fine-tune of o4-mini. Their output-price ratio is `6 / 4.4 = 1.36`, but that is weaker evidence of weight count than the documented parent relationship. The registry retains the parent-size hypothesis and records the price alternative rather than multiplying automatically.

### Combining Scenarios

Do not count several sites repeating the same estimate, or two calculations sharing the same size anchor, as independent confirmations. An architecture contradiction must be resolved before combining numerical sizes.

When no hypothesis is preferred, a rounded geometric midpoint can provide an explicitly arbitrary operational point:

```text
selected = exp(mean(log(scenario_sizes)))
scenario_spread = max(scenario_sizes) / min(scenario_sizes)
```

This treats multiplicative differences symmetrically. It is not a statistical estimator of hidden weights, and the scenario spread is not a confidence interval. The per-model table specifies when we instead choose a family anchor, an intermediate open checkpoint or a conservative rounded value. Values should not be used as high-precision measurements.

For dense/MoE order-of-magnitude comparisons only, one may calculate `sqrt(total * active)`. This is an effective-size heuristic, not a measured dense architecture or an independent way to recover unknown MoE active weights. The JSON always keeps physical active/total assumptions, not this effective size.

## Component Counts

DeepSeek-V4.1-Flash illustrates another ambiguity: its [publisher card](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash) describes a 552 B backbone plus 196 B of Engram conditional memory. We store their sum, 748 B, as an estimated core total rather than silently dropping that memory. Separate vision/projector and speculative-decoding components are not fully accounted for, so this is not an exact all-component weight count. The 16 B active value is the published decode value; prefill uses 8 B. A single active scalar cannot represent both phases.

Image/video hypotheses likewise refer to the core generator, not an entire deployed service including encoders, codecs, safety models and routers. Do not compare these totals as if every source used identical component boundaries.

## Coverage And Remaining Limits

The [cloud inventory](./cloud-coverage.md) accounts for every identifier observed in the inspected public pages. It is not a full authenticated regional availability matrix, nor a census of arbitrary marketplace imports and self-deployable community checkpoints. Historical, preview and restricted models are retained. Provider entries do not guarantee present access in every region.

Local hypotheses allow otherwise documented models to be included without pretending their hidden sizes are known. Unresolved historical estimates remain explicitly listed rather than silently converted into newly invented, supposedly independent values. No CSV is edited in this audit; the existing pipeline remains responsible for generating it.
