# Parameter Provenance

Baseline audit: 2026-10-01. The November 2026 sections below record the 2026-11-10 refresh separately. Counts are in billions; columns always distinguish active from total parameters. See the [methodology and limitations](./README.md).

This is a dated provenance record, not a claim that proprietary architectures have been disclosed. It covers the closed-model parameter estimates in this revision and three new open-weight family proxies. Open-weight model cards are linked directly in `models.json`.

## LifeArchitect

The following 65 entries use values read from the public [Models Table](https://lifearchitect.ai/models-table/), not a ratio inferred from its total column. Dense active counts equal total counts. All remain marked as estimates. GPT-4-32k shares the GPT-4 Classic family estimate rather than a separate measurement.

| Model | Public table row | Active | Total |
| --- | --- | ---: | ---: |
| `amazon-nova-premier` | Nova Premier | 470 | 470 |
| `amazon-nova-pro` | Nova Pro | 90 | 90 |
| `claude-3-opus` | Claude 3 Opus | 125 | 2500 |
| `claude-3.5-sonnet` | Claude 3.5 Sonnet | 400 | 400 |
| `claude-3.5-sonnet-v2` | Claude 3.5 Sonnet (new) | 400 | 400 |
| `claude-3.7-sonnet` | Claude 3.7 Sonnet | 400 | 400 |
| `claude-fable-5` | Claude Fable 5 | 150 | 10000 |
| `claude-fable-5.1` | Claude Fable 5.1 | 150 | 10000 |
| `claude-mythos-5` | Claude Mythos 5 | 150 | 10000 |
| `claude-mythos-5.1` | Claude Mythos 5.1 | 150 | 10000 |
| `claude-mythos-preview` | Claude Mythos Preview | 150 | 10000 |
| `claude-opus-4` | Claude Opus 4 | 150 | 6000 |
| `claude-opus-4.1` | Claude Opus 4.1 | 150 | 5000 |
| `claude-opus-4.5` | Claude Opus 4.5 | 150 | 5000 |
| `claude-opus-4.6` | Claude Opus 4.6 | 150 | 5000 |
| `claude-opus-4.7` | Claude Opus 4.7 | 150 | 5000 |
| `claude-opus-4.8` | Claude Opus 4.8 | 150 | 5000 |
| `claude-opus-5` | Claude Opus 5 | 150 | 5000 |
| `claude-opus-5.5` | Claude Opus 5.5 | 150 | 3000 |
| `claude-sonnet-4.5` | Claude Sonnet 4.5 | 20 | 1000 |
| `claude-sonnet-4.6` | Claude Sonnet 4.6 | 20 | 1000 |
| `claude-sonnet-5` | Claude Sonnet 5 | 20 | 1000 |
| `claude-sonnet-5.5` | Claude Sonnet 5.5 | 40 | 2000 |
| `gemini-3-flash` | Gemini 3 Flash | 10 | 200 |
| `gemini-3-pro` | Gemini 3 Pro | 150 | 3000 |
| `gemini-3.1-pro` | Gemini 3.1 Pro | 150 | 3000 |
| `gemini-3.5-flash` | Gemini 3.5 Flash | 25 | 500 |
| `gemini-3.6-flash` | Gemini 3.6 Flash | 25 | 500 |
| `gemini-3.7-flash` | Gemini 3.7 Flash | 25 | 500 |
| `gemini-3.8-flash` | Gemini 3.8 Flash | 25 | 500 |
| `gpt-35-turbo` | ChatGPT (gpt-3.5-turbo) | 20 | 20 |
| `gpt-4` | GPT-4 Classic | 88 | 1760 |
| `gpt-4-32k` | GPT-4 Classic | 88 | 1760 |
| `gpt-4-turbo` | GPT-4 Turbo | 3.5 | 70 |
| `gpt-4.1` | GPT-4.1 | 15 | 300 |
| `gpt-4.5` | GPT-4.5 | 225 | 4500 |
| `gpt-4o` | GPT-4o | 10 | 200 |
| `gpt-4o-mini` | GPT-4o mini | 0.4 | 8 |
| `gpt-5` | GPT-5 | 150 | 3000 |
| `gpt-5.1` | GPT-5.1 | 150 | 3000 |
| `gpt-5.2` | GPT-5.2 | 150 | 3000 |
| `gpt-5.3-chat` | GPT-5.3 Instant | 15 | 300 |
| `gpt-5.4` | GPT-5.4 | 150 | 3000 |
| `gpt-5.5` | GPT-5.5 | 150 | 3000 |
| `gpt-5.6-cyber` | GPT-5.6-Cyber | 150 | 5000 |
| `gpt-5.6-sol` | GPT-5.6 Sol | 150 | 5000 |
| `gpt-6-astra` | GPT-6 Astra | 250 | 10000 |
| `gpt-6-sol` | GPT-6 Sol | 150 | 2500 |
| `gpt-6.1-sol` | GPT-6.1 Sol | 150 | 2500 |
| `grok-4` | Grok 4 | 150 | 3000 |
| `grok-4.3` | Grok 4.3 | 25 | 500 |
| `grok-4.6` | Grok 4.6 | 75 | 1500 |
| `grok-4.7` | Grok 4.7 | 105 | 2100 |
| `grok-code-fast-1` | grok-code-fast-1 | 40 | 800 |
| `mai-thinking-1` | MAI-Thinking-1 | 35 | 1000 |
| `mistral-large-2402` | Mistral Large | 300 | 300 |
| `mistral-medium-3` | Mistral Medium 3 | 50 | 50 |
| `muse-spark-1.3` | Muse Spark 1.3 | 50 | 500 |
| `nova-pro` | Nova Pro | 90 | 90 |
| `o1` | o1 | 10 | 200 |
| `o1-preview` | o1-preview | 10 | 200 |
| `o3` | o3 | 30 | 600 |
| `o3-mini` | o3-mini | 70 | 70 |
| `o4-mini` | o4-mini | 10 | 200 |
| `text-davinci-003` | text-davinci-003 | 175 | 175 |

## EcoLogits And Adaptations

Credit: EcoLogits contributors, including Samuel Rince. Sources: [pinned model registry](https://github.com/mlco2/ecologits/blob/c739e8d61f6a12a85864adb698ab85623fe70f3c/ecologits/data/models.json), [proprietary-model estimate table](https://docs.google.com/spreadsheets/d/1XkPTkrGxpwWpIVIxpVvgRJuInSZsqbndTQbFGcHhdd0/edit#gid=803926269) and [methodology](https://ecologits.ai/latest/methodology/proprietary_models/).

These values are retained conservatively where their numerical lineage matches EcoLogits and no independent, checkpoint-specific replacement was verified. A matching value alone does not prove copying; attribution is retained rather than claiming independent derivation. The source row and transformation below distinguish EcoLogits estimates from local extensions.

A midpoint collapses upstream uncertainty: it is not a more accurate measurement. Historical rounding is preserved (for example, 47.5 becomes 48). A family proxy reuses a different model row and must not be represented as an EcoLogits measurement of that variant.

| Catalog model | EcoLogits source row | Source active range | Source total range | Catalog active / total | Adaptation |
| --- | --- | --- | --- | --- | --- |
| `claude-3.5-haiku` | `claude-3-5-haiku` | 8B-28B | 8B-28B | 18 / 18 | Midpoint, retaining rounding |
| `claude-haiku-4.5` | `clause-haiku-4-5` | 10-35B | 10-35B | 23 / 23 | Midpoint, retaining rounding |
| `claude-sonnet-4` | `claude-sonnet-4` | 44B-132B | 440B | 88 / 440 | Midpoint, retaining rounding |
| `gemini-2.0-flash` | `gemini-2.0-flash` | 44B-132B | 440B | 88 / 440 | Midpoint, retaining rounding |
| `gemini-2.0-flash-lite` | `gemini-2.0-flash-lite` | 8B-28B | 8B-28B | 18 / 18 | Midpoint, retaining rounding |
| `gemini-2.5-flash` | `gemini-2.5-flash` | 44B-132B | 440B | 88 / 440 | Midpoint, retaining rounding |
| `gemini-2.5-flash-image` | `gemini-2.5-flash` | 44B-132B | 440B | 88 / 440 | Local family proxy |
| `gemini-2.5-flash-lite` | `gemini-2.5-flash-lite` | 8B-28B | 8B-28B | 18 / 18 | Midpoint, retaining rounding |
| `gemini-2.5-flash-live-api` | `gemini-2.5-flash` | 44B-132B | 440B | 88 / 440 | Local family proxy |
| `gemini-2.5-flash-tts` | `gemini-2.5-flash` | 44B-132B | 440B | 88 / 440 | Local family proxy |
| `gemini-2.5-pro` | `gemini-2.5-pro` | 200B-600B | 2000B | 400 / 2000 | Midpoint, retaining rounding |
| `gemini-2.5-pro-tts` | `gemini-2.5-pro` | 200B-600B | 2000B | 400 / 2000 | Local family proxy |
| `gemini-3-pro-image` | `gemini-3-pro` | 120B-360B | 1200B | 240 / 1200 | Local family proxy |
| `gemini-3.1-flash-image` | `gemini-3-pro` | 120B-360B | 1200B | 240 / 1200 | Local family proxy |
| `gemini-3.1-flash-lite` | `gemini-3.1-flash-lite` | 30B-105B | 30B-105B | 68 / 68 | Midpoint, retaining rounding |
| `gemini-3.1-flash-lite-image` | `gemini-3-flash` | 30B-100B | 300B | 65 / 300 | Local family proxy |
| `gemini-3.1-flash-live` | `gemini-3-flash` | 30B-100B | 300B | 65 / 300 | Local family proxy |
| `gemini-3.1-flash-tts` | `gemini-3-flash` | 30B-100B | 300B | 65 / 300 | Local family proxy |
| `gemini-3.5-flash-lite` | `gemini-3.1-flash-lite` | 30B-105B | 30B-105B | 68 / 68 | Local family proxy |
| `gemini-3.5-live-translate` | `gemini-3-flash` | 30B-100B | 300B | 65 / 300 | Local family proxy |
| `gpt-35-turbo-16k` | `gpt-3.5-turbo` | 20B-70B | 20B-70B | 45 / 45 | Local family proxy |
| `gpt-4-turbo-vision` | `gpt-4-turbo` | 88B-264B | 880B | 140 / 880 | Local active scaling; see note below |
| `gpt-4.1-mini` | `gpt-4.1-mini` | 40B-112B | 40B-112B | 76 / 76 | Midpoint, retaining rounding |
| `gpt-4.1-nano` | `gpt-4.1-nano` | 10B-37B | 10B-37B | 24 / 24 | Midpoint, retaining rounding |
| `gpt-4o-audio` | `gpt-4o` | 44B-132B | 440B | 88 / 440 | Local family proxy |
| `gpt-4o-audio-preview` | `gpt-4o` | 44B-132B | 440B | 88 / 440 | Local family proxy |
| `gpt-4o-mini-audio` | `gpt-4o-mini` | 8B-28B | 8B-28B | 18 / 18 | Local family proxy |
| `gpt-4o-mini-audio-preview` | `gpt-4o-mini` | 8B-28B | 8B-28B | 18 / 18 | Local family proxy |
| `gpt-4o-mini-realtime` | `gpt-4o-mini` | 8B-28B | 8B-28B | 18 / 18 | Local family proxy |
| `gpt-4o-mini-realtime-audio` | `gpt-4o-mini` | 8B-28B | 8B-28B | 18 / 18 | Local family proxy |
| `gpt-4o-mini-realtime-preview` | `gpt-4o-mini` | 8B-28B | 8B-28B | 18 / 18 | Local family proxy |
| `gpt-4o-mini-transcribe` | `gpt-4o-mini` | 8B-28B | 8B-28B | 18 / 18 | Local family proxy |
| `gpt-4o-mini-tts` | `gpt-4o-mini` | 8B-28B | 8B-28B | 18 / 18 | Local family proxy |
| `gpt-4o-realtime-preview` | `gpt-4o` | 44B-132B | 440B | 88 / 440 | Local family proxy |
| `gpt-4o-transcribe` | `gpt-4o` | 44B-132B | 440B | 88 / 440 | Local family proxy |
| `gpt-4o-transcribe-diarize` | `gpt-4o` | 44B-132B | 440B | 88 / 440 | Local family proxy |
| `gpt-5-chat` | `gpt-5` | 30B-90B | 300B | 60 / 300 | Local family proxy |
| `gpt-5-codex` | `gpt-5` | 30B-90B | 300B | 60 / 300 | Local family proxy |
| `gpt-5-mini` | `gpt-5-mini` | 25B-70B | 25B-70B | 48 / 48 | Midpoint, retaining rounding |
| `gpt-5-nano` | `gpt-5-nano` | 5B-18.5B | 5B-18.5B | 12 / 12 | Midpoint, retaining rounding |
| `gpt-5-pro` | `gpt-5-pro` | 360B-1080B | 3600B | 720 / 3600 | Midpoint, retaining rounding |
| `gpt-5.4-mini` | `gpt-5.4-mini` | 56B-158B | 56B-158B | 107 / 107 | Midpoint, retaining rounding |
| `gpt-5.4-nano` | `gpt-5.4-nano` | 15B-58B | 15B-58B | 37 / 37 | Midpoint, retaining rounding |
| `gpt-5.4-pro` | `gpt-5.4-pro` | 540-1800B | 5400B | 1170 / 5400 | Midpoint, retaining rounding |
| `gpt-6-luna` | `gpt-6-luna` | 3.8B-11B | 38B | 7.4 / 38 | Midpoint, retaining rounding |
| `o1-mini` | `o1-mini` | 8B-28B | 8B-28B | 18 / 18 | Midpoint, retaining rounding |
| `o1-pro` | `o1` | 44B-132B | 440B | 88 / 440 | Local family proxy |

`gpt-4-turbo-vision`: the retained 880 B total follows the EcoLogits GPT-4 Turbo row. The 140 B active count is a historical local scaling assumption (half the former 280 B GPT-4 estimate), not EcoLogits' 176 B midpoint. It remains unvalidated and is not recalculated from the newly selected GPT-4 estimate.

The pinned EcoLogits repository is published under [MPL-2.0](https://github.com/mlco2/ecologits/blob/c739e8d61f6a12a85864adb698ab85623fe70f3c/LICENSE). These notices and links identify the reused estimates and our transformations; they do not replace the upstream license or imply that attribution alone resolves every reuse obligation. Upstream rights are preserved alongside this repository's [license](../../LICENSE).

## Open-Weight Family Proxies

| Model | Proxy source | Active | Total |
| --- | --- | ---: | ---: |
| `glm-4.7` | [GLM-4.5](https://huggingface.co/zai-org/GLM-4.5) | 32 | 355 |
| `glm-5.2` | [GLM-5](https://huggingface.co/zai-org/GLM-5) | 40 | 744 |
| `glm-5.3` | [GLM-5](https://huggingface.co/zai-org/GLM-5) | 40 | 744 |

These three sizes are explicitly estimated; the linked parent checkpoint does not establish the parameter count of each later checkpoint. GLM-5.3-Flash has its own published 320 B / 18 B specification and does not use this proxy.

## Local Hypotheses

41 entries use explicitly local sizing assumptions. Undisclosed parameter/architecture values below have low confidence: they make calculations possible, not the proprietary weights known. The source links establish the anchors or public API facts, not the inferred target size. The original Ministral 3B has a published nominal total, but its dense active-count assumption is distinguished from that fact.

Scenarios are compared before choosing a point estimate. A documented parent takes precedence over a token-price ratio. Otherwise the selected analogue or rounded geometric midpoint is stated per row. A scenario spread is a sensitivity check, not a statistical confidence interval; correlated estimates are not independent confirmations. No new hypotheses were created just to remove an EcoLogits attribution.

Prices are the standard public rates consulted on 2026-10-01, except the Grok 4.1 Fast anchor from its 2025-11-19 release announcement. They exclude batch/cached discounts and may change independently of model size. TTS comparisons use characters, not tokens. See the [calculation rules](./README.md#calculation-rules).

| Model | Selected active / total (B) | Scenarios, selection and limits | Numerical anchors |
| --- | ---: | --- | --- |
| `codex-mini` | 10 / 200 | OpenAI explicitly calls this a fine-tuned o4-mini. Select the LifeArchitect parent estimate 10 / 200 B. A price ratio $6 / $4.40 per million output tokens gives 13.64 / 272.73 B, 1.36x higher; rejected as the primary estimate because documented fine-tuning is stronger evidence than price. | [anchor 1](https://lifearchitect.ai/models-table/), [anchor 2](https://developers.openai.com/api/docs/models/o4-mini) |
| `cohere-parse-v5` | 8 / 8 | Visual document-parser analogue: Cohere Aya Vision 8 B versus 32 B (4x spread). Select 8 B as a compact OCR-oriented scenario, not confirmed ancestry. No token context asserted: the documented API accepts document images rather than an exposed conversational token window. | [anchor 1](https://huggingface.co/CohereLabs/aya-vision-8b), [anchor 2](https://huggingface.co/CohereLabs/aya-vision-32b) |
| `computer-use-preview` | 10 / 200 | Multimodal agent analogue: LifeArchitect GPT-4o 10 active / 200 total. Price scenario using official output prices $12 vs $10 per million text tokens gives 12 / 240 B (1.2x). Prefer the unscaled analogue: tool specialization does not establish larger weights. No confirmed parentage. | [anchor 1](https://lifearchitect.ai/models-table/), [anchor 2](https://developers.openai.com/api/docs/models/gpt-4o) |
| `flux-1-kontext-pro` | 12 / 12 | Same-generation open-family proxy: 12 B dense and hidden width 3072. FLUX.1 (12 B) versus FLUX.2 (32 B) gives a 2.67x cross-generation alternative, but the matching generation is preferred. Pro/flex labels and inference steps alone do not establish weight counts. | [anchor 1](https://huggingface.co/black-forest-labs/FLUX.1-dev), [anchor 2](https://github.com/black-forest-labs/flux/blob/main/src/flux/util.py) |
| `flux-1.1-pro` | 12 / 12 | Same-generation open-family proxy: 12 B dense and hidden width 3072. FLUX.1 (12 B) versus FLUX.2 (32 B) gives a 2.67x cross-generation alternative, but the matching generation is preferred. Pro/flex labels and inference steps alone do not establish weight counts. | [anchor 1](https://huggingface.co/black-forest-labs/FLUX.1-dev), [anchor 2](https://github.com/black-forest-labs/flux/blob/main/src/flux/util.py) |
| `flux-2-flex` | 32 / 32 | Same-generation open-family proxy: 32 B dense and hidden width 6144. FLUX.1 (12 B) versus FLUX.2 (32 B) gives a 2.67x cross-generation alternative, but the matching generation is preferred. Pro/flex labels and inference steps alone do not establish weight counts. | [anchor 1](https://huggingface.co/black-forest-labs/FLUX.2-dev), [anchor 2](https://github.com/black-forest-labs/flux2/blob/main/src/flux2/model.py) |
| `flux-2-pro` | 32 / 32 | Same-generation open-family proxy: 32 B dense and hidden width 6144. FLUX.1 (12 B) versus FLUX.2 (32 B) gives a 2.67x cross-generation alternative, but the matching generation is preferred. Pro/flex labels and inference steps alone do not establish weight counts. | [anchor 1](https://huggingface.co/black-forest-labs/FLUX.2-dev), [anchor 2](https://github.com/black-forest-labs/flux2/blob/main/src/flux2/model.py) |
| `gemini-3.8-flash-cyber` | 25 / 500 | LifeArchitect Gemini-3.8-Flash family-scale proxy 25 / 500 B; compare Gemini-3-Flash 10 / 200 B (2.5x spread). Retain the more recent anchor. Google documents post-training of 3.8 Flash, supporting a parent-weight proxy. | [anchor 1](https://lifearchitect.ai/models-table/) |
| `gemini-3.8-live` | 25 / 500 | LifeArchitect Gemini-3.8-Flash family-scale proxy 25 / 500 B; compare Gemini-3-Flash 10 / 200 B (2.5x spread). Retain the more recent anchor. Naming/capability analogy is not evidence of shared weights, especially for generative video or live audio components. | [anchor 1](https://lifearchitect.ai/models-table/) |
| `gemini-embedding-001` | 3.1 / 3.1 | Dense text-embedding scenarios: Gecko 1.2 B and Qwen3-Embedding 8 B (6.67x spread); sqrt(1.2 * 8) = 3.098, rounded to 3.1 B. Cross-family analogy, not a Gemini architecture disclosure. Output dimension cannot determine model size. | [anchor 1](https://arxiv.org/abs/2403.20327), [anchor 2](https://huggingface.co/Qwen/Qwen3-Embedding-8B) |
| `gemini-omni-1.1-flash` | 25 / 500 | LifeArchitect Gemini-3.8-Flash family-scale proxy 25 / 500 B; compare Gemini-3-Flash 10 / 200 B (2.5x spread). Retain the more recent anchor. Naming/capability analogy is not evidence of shared weights, especially for generative video or live audio components. | [anchor 1](https://lifearchitect.ai/models-table/) |
| `gemini-omni-flash` | 25 / 500 | LifeArchitect Gemini-3.8-Flash family-scale proxy 25 / 500 B; compare Gemini-3-Flash 10 / 200 B (2.5x spread). Retain the more recent anchor. Naming/capability analogy is not evidence of shared weights, especially for generative video or live audio components. | [anchor 1](https://lifearchitect.ai/models-table/) |
| `gpt-image-2.5-flare` | 20 / 20 | Open image-generator analogues: FLUX.1-dev 12 B and FLUX.2-dev 32 B; sqrt(12 * 32) = 19.60, rounded to 20 B dense (2.67x spread). This estimates the core generator, not all service components. No size multiplier for Flash/Pro or quality presets. Hidden width 6144 is borrowed from FLUX.2, not measured. Context 32000 is an image-API analogue from Azure FLUX.2, not an OpenAI disclosure. Flare and Sunburst share $30/M image-output-token pricing, which does not prove equal weights. | [anchor 1](https://huggingface.co/black-forest-labs/FLUX.1-dev), [anchor 2](https://huggingface.co/black-forest-labs/FLUX.2-dev), [anchor 3](https://github.com/black-forest-labs/flux2/blob/main/src/flux2/model.py), [anchor 4](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-image-2.5-sunburst` | 20 / 20 | Open image-generator analogues: FLUX.1-dev 12 B and FLUX.2-dev 32 B; sqrt(12 * 32) = 19.60, rounded to 20 B dense (2.67x spread). This estimates the core generator, not all service components. No size multiplier for Flash/Pro or quality presets. Hidden width 6144 is borrowed from FLUX.2, not measured. Context 32000 is an image-API analogue from Azure FLUX.2, not an OpenAI disclosure. Flare and Sunburst share $30/M image-output-token pricing, which does not prove equal weights. | [anchor 1](https://huggingface.co/black-forest-labs/FLUX.1-dev), [anchor 2](https://huggingface.co/black-forest-labs/FLUX.2-dev), [anchor 3](https://github.com/black-forest-labs/flux2/blob/main/src/flux2/model.py), [anchor 4](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `grok-4.1-fast-non-reasoning` | 25 / 500 | Price scenario: Grok-4.3 LifeArchitect 25 / 500 B scaled by $0.50 / $2.50 per million output tokens = 5 / 100 B. Family-scale scenario: retain 25 / 500 B (5x disagreement). Select the unscaled 25 / 500 B, because a Fast endpoint can reduce cost without proportional weight reduction. This is NOT LifeArchitect's 4.1-Fast estimate. No architecture/count difference assumed between reasoning modes. | [anchor 1](https://lifearchitect.ai/models-table/), [anchor 2](https://docs.x.ai/developers/models/grok-4.3), [anchor 3](https://x.ai/news/grok-4-1-fast) |
| `grok-4.1-fast-reasoning` | 25 / 500 | Price scenario: Grok-4.3 LifeArchitect 25 / 500 B scaled by $0.50 / $2.50 per million output tokens = 5 / 100 B. Family-scale scenario: retain 25 / 500 B (5x disagreement). Select the unscaled 25 / 500 B, because a Fast endpoint can reduce cost without proportional weight reduction. This is NOT LifeArchitect's 4.1-Fast estimate. No architecture/count difference assumed between reasoning modes. | [anchor 1](https://lifearchitect.ai/models-table/), [anchor 2](https://docs.x.ai/developers/models/grok-4.3), [anchor 3](https://x.ai/news/grok-4-1-fast) |
| `grok-4.20-non-reasoning` | 25 / 500 | Grok-4.3 analogue: LifeArchitect 25 / 500 B. Same-provider standard output prices $2.50 / $2.50 imply ratio 1 and the same 25 / 500 B scenario. Shared sizing anchor means these are not independent confirmations. MoE and the 5% active fraction remain hypotheses. | [anchor 1](https://lifearchitect.ai/models-table/), [anchor 2](https://docs.x.ai/developers/models/grok-4.3), [anchor 3](https://x.ai/news/grok-4-1-fast) |
| `grok-4.20-reasoning` | 25 / 500 | Grok-4.3 analogue: LifeArchitect 25 / 500 B. Same-provider standard output prices $2.50 / $2.50 imply ratio 1 and the same 25 / 500 B scenario. Shared sizing anchor means these are not independent confirmations. MoE and the 5% active fraction remain hypotheses. | [anchor 1](https://lifearchitect.ai/models-table/), [anchor 2](https://docs.x.ai/developers/models/grok-4.3), [anchor 3](https://x.ai/news/grok-4-1-fast) |
| `lyria-002` | 3.3 / 3.3 | Open music-generator scenarios: MusicGen medium 1.5 B and large 3.3 B (2.2x spread). Select 3.3 B dense as the larger analogue; image conditioning, singing and proprietary codecs may add uncounted weights. Clip duration and Pro naming do not determine parameter counts. | [anchor 1](https://huggingface.co/facebook/musicgen-medium), [anchor 2](https://huggingface.co/facebook/musicgen-large) |
| `lyria-3-clip` | 3.3 / 3.3 | Open music-generator scenarios: MusicGen medium 1.5 B and large 3.3 B (2.2x spread). Select 3.3 B dense as the larger analogue; image conditioning, singing and proprietary codecs may add uncounted weights. Clip duration and Pro naming do not determine parameter counts. | [anchor 1](https://huggingface.co/facebook/musicgen-medium), [anchor 2](https://huggingface.co/facebook/musicgen-large) |
| `lyria-3-pro` | 3.3 / 3.3 | Open music-generator scenarios: MusicGen medium 1.5 B and large 3.3 B (2.2x spread). Select 3.3 B dense as the larger analogue; image conditioning, singing and proprietary codecs may add uncounted weights. Clip duration and Pro naming do not determine parameter counts. | [anchor 1](https://huggingface.co/facebook/musicgen-medium), [anchor 2](https://huggingface.co/facebook/musicgen-large) |
| `mai-image-2.5` | 20 / 20 | Open image-generator analogues: FLUX.1-dev 12 B and FLUX.2-dev 32 B; sqrt(12 * 32) = 19.60, rounded to 20 B dense (2.67x spread). This estimates the core generator, not all service components. No size multiplier for Flash/Pro or quality presets. Hidden width 6144 is borrowed from FLUX.2, not measured. Context 32000 is published by Azure. | [anchor 1](https://huggingface.co/black-forest-labs/FLUX.1-dev), [anchor 2](https://huggingface.co/black-forest-labs/FLUX.2-dev), [anchor 3](https://github.com/black-forest-labs/flux2/blob/main/src/flux2/model.py) |
| `mai-image-2.5-flash` | 20 / 20 | Open image-generator analogues: FLUX.1-dev 12 B and FLUX.2-dev 32 B; sqrt(12 * 32) = 19.60, rounded to 20 B dense (2.67x spread). This estimates the core generator, not all service components. No size multiplier for Flash/Pro or quality presets. Hidden width 6144 is borrowed from FLUX.2, not measured. Context 32000 is published by Azure. | [anchor 1](https://huggingface.co/black-forest-labs/FLUX.1-dev), [anchor 2](https://huggingface.co/black-forest-labs/FLUX.2-dev), [anchor 3](https://github.com/black-forest-labs/flux2/blob/main/src/flux2/model.py) |
| `mai-image-2.5-pro` | 20 / 20 | Open image-generator analogues: FLUX.1-dev 12 B and FLUX.2-dev 32 B; sqrt(12 * 32) = 19.60, rounded to 20 B dense (2.67x spread). This estimates the core generator, not all service components. No size multiplier for Flash/Pro or quality presets. Hidden width 6144 is borrowed from FLUX.2, not measured. Context 32000 is published by Azure. | [anchor 1](https://huggingface.co/black-forest-labs/FLUX.1-dev), [anchor 2](https://huggingface.co/black-forest-labs/FLUX.2-dev), [anchor 3](https://github.com/black-forest-labs/flux2/blob/main/src/flux2/model.py) |
| `mai-image-2.6` | 20 / 20 | Open image-generator analogues: FLUX.1-dev 12 B and FLUX.2-dev 32 B; sqrt(12 * 32) = 19.60, rounded to 20 B dense (2.67x spread). This estimates the core generator, not all service components. No size multiplier for Flash/Pro or quality presets. Hidden width 6144 is borrowed from FLUX.2, not measured. Context 32000 is published by Azure. | [anchor 1](https://huggingface.co/black-forest-labs/FLUX.1-dev), [anchor 2](https://huggingface.co/black-forest-labs/FLUX.2-dev), [anchor 3](https://github.com/black-forest-labs/flux2/blob/main/src/flux2/model.py) |
| `mai-image-2.6-flash` | 20 / 20 | Open image-generator analogues: FLUX.1-dev 12 B and FLUX.2-dev 32 B; sqrt(12 * 32) = 19.60, rounded to 20 B dense (2.67x spread). This estimates the core generator, not all service components. No size multiplier for Flash/Pro or quality presets. Hidden width 6144 is borrowed from FLUX.2, not measured. Context 32000 is published by Azure. | [anchor 1](https://huggingface.co/black-forest-labs/FLUX.1-dev), [anchor 2](https://huggingface.co/black-forest-labs/FLUX.2-dev), [anchor 3](https://github.com/black-forest-labs/flux2/blob/main/src/flux2/model.py) |
| `marengo-embed-2.7` | 4 / 4 | Open multimodal-embedding analogues: Qwen3-VL-Embedding 2 B and 8 B. Geometric midpoint sqrt(2 * 8) = 4 B; 4x scenario spread. These omit a separately identifiable audio tower. Dense is an assumption. Context is the text-input limit, not video capacity. | [anchor 1](https://huggingface.co/Qwen/Qwen3-VL-Embedding-2B), [anchor 2](https://huggingface.co/Qwen/Qwen3-VL-Embedding-8B) |
| `marengo-embed-3.0` | 4 / 4 | Open multimodal-embedding analogues: Qwen3-VL-Embedding 2 B and 8 B. Geometric midpoint sqrt(2 * 8) = 4 B; 4x scenario spread. These omit a separately identifiable audio tower. Dense is an assumption. Context is the text-input limit, not video capacity. | [anchor 1](https://huggingface.co/Qwen/Qwen3-VL-Embedding-2B), [anchor 2](https://huggingface.co/Qwen/Qwen3-VL-Embedding-8B) |
| `ministral-3b` | 3 / 3 | Published nominal total: 3 B for the original text-only Ministral. Dense and active = total are assumptions; the newer open Ministral 3 3B is a distinct 3.4 B language + 0.4 B vision model, not confirmation of this older architecture. | [Mistral release](https://mistral.ai/news/ministraux/) |
| `mistral-small-2402` | 22 / 22 | Backward family proxy: 22 B from the later Small-2409 checkpoint; compare Small-3 at 24 B (1.09x). Retain the nearer 22 B generation, not a claim of unchanged weights. | [anchor 1](https://huggingface.co/mistralai/Mistral-Small-Instruct-2409), [anchor 2](https://huggingface.co/mistralai/Mistral-Small-24B-Instruct-2501) |
| `multimodalembedding-001` | 0.4 / 0.4 | Use the nominal SigLIP SO400M visual-backbone scale (0.4 B) as a lower-complexity analogue; Qwen3-VL-Embedding-2B supplies a 2 B alternative (5x spread). Select 0.4 B for this older short-text API; text/video towers may add weights. Context is the documented 32-token text limit, not video duration. | [anchor 1](https://huggingface.co/google/siglip-so400m-patch14-384), [anchor 2](https://huggingface.co/Qwen/Qwen3-VL-Embedding-2B) |
| `palmyra-x4` | 73 / 73 | Publisher-family anchors: X-004 dummy-weight metadata and X-4.3-73B both indicate the 73 B scale, alongside the nominal Fin-70B family. Select 73 B dense as a family proxy, not a disclosed count for this API version. Dummy weights do not establish open-weight status. The 70-73 B comparison is correlated family evidence; X5 may differ substantially. | [anchor 1](https://huggingface.co/Writer/palmyra-x-004-dummy-weights), [anchor 2](https://huggingface.co/Writer/Palmyra-X-4.3-73B), [anchor 3](https://huggingface.co/Writer/Palmyra-Fin-70B-32K) |
| `palmyra-x5` | 73 / 73 | Publisher-family anchors: X-004 dummy-weight metadata and X-4.3-73B both indicate the 73 B scale, alongside the nominal Fin-70B family. Select 73 B dense as a family proxy, not a disclosed count for this API version. Dummy weights do not establish open-weight status. The 70-73 B comparison is correlated family evidence; X5 may differ substantially. | [anchor 1](https://huggingface.co/Writer/palmyra-x-004-dummy-weights), [anchor 2](https://huggingface.co/Writer/Palmyra-X-4.3-73B), [anchor 3](https://huggingface.co/Writer/Palmyra-Fin-70B-32K) |
| `pegasus-1.2` | 32 / 32 | Open video-understanding analogues: Qwen2.5-VL 7 B and 72 B (10.3x spread); select its intermediate 32 B checkpoint rather than extrapolating from price per video second. Context is the published 2000-token text-prompt limit, not a joint video/text window. | [anchor 1](https://huggingface.co/Qwen/Qwen2.5-VL-7B-Instruct), [anchor 2](https://huggingface.co/Qwen/Qwen2.5-VL-32B-Instruct), [anchor 3](https://huggingface.co/Qwen/Qwen2.5-VL-72B-Instruct) |
| `sora-2` | 14 / 14 | Open video-generator analogues: Wan2.1 14 B and HunyuanVideo 13 B (1.08x spread); sqrt(14 * 13) = 13.49, conservatively rounded upward to 14 B dense. Core video generator only: separate audio/encoder components are not quantified. Fast does not automatically mean fewer weights. This narrow anchor spread is not a confidence interval for the proprietary model. | [anchor 1](https://huggingface.co/Wan-AI/Wan2.1-T2V-14B), [anchor 2](https://huggingface.co/tencent/HunyuanVideo) |
| `text-embedding-005` | 1.2 / 1.2 | Google Gecko research model (1.2 B) is the preferred same-vendor text-embedding analogue. E5-large (0.56 B) supplies a lower cross-vendor scenario (2.14x spread); it does not override the nearer-family proxy. No official link from this exact API revision to Gecko weights is asserted. | [anchor 1](https://arxiv.org/abs/2403.20327), [anchor 2](https://huggingface.co/intfloat/multilingual-e5-large) |
| `text-multilingual-embedding-002` | 1.2 / 1.2 | Google Gecko research model (1.2 B) is the preferred same-vendor text-embedding analogue. E5-large (0.56 B) supplies a lower cross-vendor scenario (2.14x spread); it does not override the nearer-family proxy. No official link from this exact API revision to Gecko weights is asserted. | [anchor 1](https://arxiv.org/abs/2403.20327), [anchor 2](https://huggingface.co/intfloat/multilingual-e5-large) |
| `tts-1` | 4 / 4 | Open TTS analogue: Voxtral-TTS 4 B; select 4 B dense. No comparable token-price calibration: the API bills characters, not tokens. | [anchor 1](https://huggingface.co/mistralai/Voxtral-4B-TTS-2603), [anchor 2](https://developers.openai.com/api/docs/models/tts-1), [anchor 3](https://developers.openai.com/api/docs/models/tts-1-hd) |
| `tts-1-hd` | 6 / 6 | Two scenarios: unchanged TTS-1-sized weights at 4 B, or price scaling 4 * ($30 / $15) = 8 B using dollars per million characters, not tokens. sqrt(4 * 8) = 5.66, rounded to 6 B dense. A 2x spread is a sensitivity range, not measured uncertainty. | [anchor 1](https://huggingface.co/mistralai/Voxtral-4B-TTS-2603), [anchor 2](https://developers.openai.com/api/docs/models/tts-1), [anchor 3](https://developers.openai.com/api/docs/models/tts-1-hd) |
| `veo-3.0` | 14 / 14 | Open video-generator analogues: Wan2.1 14 B and HunyuanVideo 13 B (1.08x spread); sqrt(14 * 13) = 13.49, conservatively rounded upward to 14 B dense. Core video generator only: separate audio/encoder components are not quantified. Fast does not automatically mean fewer weights. This narrow anchor spread is not a confidence interval for the proprietary model. | [anchor 1](https://huggingface.co/Wan-AI/Wan2.1-T2V-14B), [anchor 2](https://huggingface.co/tencent/HunyuanVideo) |
| `veo-3.0-fast` | 14 / 14 | Open video-generator analogues: Wan2.1 14 B and HunyuanVideo 13 B (1.08x spread); sqrt(14 * 13) = 13.49, conservatively rounded upward to 14 B dense. Core video generator only: separate audio/encoder components are not quantified. Fast does not automatically mean fewer weights. This narrow anchor spread is not a confidence interval for the proprietary model. | [anchor 1](https://huggingface.co/Wan-AI/Wan2.1-T2V-14B), [anchor 2](https://huggingface.co/tencent/HunyuanVideo) |

Public capability/context sources are also linked in each `models.json` entry. For image proxies, `hidden_dimension` describes an assumed core-generator width, not an embedding/output image dimension. No image price-per-pixel or video price-per-second was treated as a text-token price.

## Unresolved Historical Estimates

94 existing entries still lack a version-specific numerical source verified in this pass. Their values were not changed or relabelled as independent estimates. Official API/catalog URLs establish public capabilities, not hidden weights. This audit URL documents uncertainty; it is not numerical evidence.

Generic LifeArchitect/ApXML references were removed from these entries unless retained for a historical corpus estimate. A remaining LifeArchitect URL in this section is therefore not an attribution for the parameter values below. Corpus values in these entries were not revalidated in this pass.

| Model | Retained active | Retained total |
| --- | ---: | ---: |
| `ada` | 0.35 | 0.35 |
| `amazon-nova-2-lite` | 64 | 64 |
| `amazon-nova-2-sonic` | 24 | 24 |
| `amazon-nova-canvas` | 12 | 12 |
| `amazon-nova-lite` | 32 | 32 |
| `amazon-nova-micro` | 8 | 8 |
| `amazon-nova-multimodal-embeddings` | 8 | 8 |
| `amazon-nova-reel` | 24 | 24 |
| `amazon-nova-sonic` | 20 | 20 |
| `amazon-rerank-1.0` | 1 | 1 |
| `amazon-titan-image-generator-g1-v2` | 5 | 5 |
| `amazon-titan-multimodal-embeddings-g1` | 2 | 2 |
| `amazon-titan-text-embeddings-v1` | 1.5 | 1.5 |
| `amazon-titan-text-embeddings-v2` | 1.5 | 1.5 |
| `amazon-titan-text-large` | 13 | 13 |
| `babbage` | 1.3 | 1.3 |
| `babbage-002` | 1.3 | 1.3 |
| `claude` | 175 | 175 |
| `claude-3-haiku` | 20 | 20 |
| `claude-3-sonnet` | 70 | 70 |
| `claude-instant` | 13 | 13 |
| `code-davinci-002` | 175 | 175 |
| `cohere-embed-english-v3` | 0.4 | 0.4 |
| `cohere-embed-multilingual-3` | 1 | 1 |
| `cohere-embed-multilingual-v3` | 0.8 | 0.8 |
| `cohere-embed-v4` | 7 | 7 |
| `cohere-rerank-3.5` | 0.6 | 0.6 |
| `cohere-rerank-v4.0-fast` | 0.6 | 0.6 |
| `cohere-rerank-v4.0-pro` | 7 | 7 |
| `curie` | 6.7 | 6.7 |
| `davinci` | 175 | 175 |
| `davinci-002` | 175 | 175 |
| `embedding-ada` | 0.35 | 0.35 |
| `gemini-3.5-transcribe` | 8 | 8 |
| `gemini-embedding-2` | 0.7 | 0.7 |
| `gpt-4o-realtime` | 55 | 220 |
| `gpt-4o-realtime-audio` | 55 | 220 |
| `gpt-5.1-chat` | 400 | 2000 |
| `gpt-5.1-codex` | 400 | 2000 |
| `gpt-5.1-codex-max` | 480 | 1920 |
| `gpt-5.1-codex-mini` | 40 | 160 |
| `gpt-5.2-chat` | 600 | 3000 |
| `gpt-5.2-codex` | 600 | 3000 |
| `gpt-5.3-codex` | 600 | 3000 |
| `gpt-5.5-pro` | 1200 | 6000 |
| `gpt-5.6-luna` | 60 | 300 |
| `gpt-5.6-terra` | 300 | 1500 |
| `gpt-audio` | 40 | 160 |
| `gpt-audio-1.5` | 80 | 320 |
| `gpt-audio-mini` | 12 | 48 |
| `gpt-image-1` | 40 | 160 |
| `gpt-image-1-mini` | 12 | 48 |
| `gpt-image-1.5` | 64 | 256 |
| `gpt-image-2` | 80 | 320 |
| `gpt-live-transcribe` | 8 | 8 |
| `gpt-realtime` | 40 | 160 |
| `gpt-realtime-1.5` | 80 | 320 |
| `gpt-realtime-2` | 80 | 320 |
| `gpt-realtime-2.1` | 80 | 320 |
| `gpt-realtime-2.1-mini` | 24 | 96 |
| `gpt-realtime-mini` | 12 | 48 |
| `gpt-realtime-translate` | 8 | 8 |
| `gpt-realtime-whisper` | 8 | 8 |
| `gpt-transcribe` | 8 | 8 |
| `imagen-3` | 10 | 10 |
| `imagen-4` | 16 | 16 |
| `mistral large` | 123 | 123 |
| `mistral-document-ai-2505` | 24 | 24 |
| `mistral-document-ai-2512` | 24 | 24 |
| `mistral-ocr-2505` | 24 | 24 |
| `mistral-ocr-4` | 24 | 24 |
| `nova-lite` | 40 | 40 |
| `nova-micro` | 1 | 1 |
| `nvr-tts-de-de` | 1.2 | 1.2 |
| `nvr-tts-en-us` | 1.2 | 1.2 |
| `nvr-tts-es-es` | 1.2 | 1.2 |
| `nvr-tts-it-it` | 1.2 | 1.2 |
| `o3-pro` | 120 | 600 |
| `text-ada-001` | 0.35 | 0.35 |
| `text-babbage-001` | 1.3 | 1.3 |
| `text-curie-001` | 6.7 | 6.7 |
| `text-davinci-002` | 175 | 175 |
| `text-embedding-3` | 6.7 | 6.7 |
| `text-embedding-3-large` | 1.5 | 1.5 |
| `text-embedding-3-small` | 0.35 | 0.35 |
| `text-embedding-ada-002` | 0.35 | 0.35 |
| `titan-embeddings-g1` | 1 | 1 |
| `titan-embeddings-v2` | 1 | 1 |
| `titan-text-g1-express` | 15 | 15 |
| `titan-text-g1-lite` | 5 | 5 |
| `veo-3.1` | 32 | 32 |
| `veo-3.1-fast` | 24 | 24 |
| `veo-3.1-lite` | 16 | 16 |
| `voxtral-mini-transcribe` | 4 | 4 |

Known legacy duplicate conflicts were not silently resolved: `nova-lite` / `amazon-nova-lite`, `nova-micro` / `amazon-nova-micro`, and the two Cohere multilingual-v3 entries still have conflicting historical estimates. Older names are retained for compatibility; do not count these as distinct underlying models. Canonical consolidation requires a separate compatibility decision.

## November 2026 Source Review

Checked on 2026-11-10. This refresh adds canonical models and deployment identifiers; it does not delete retired models or recalculate every historical estimate. The October sections above remain dated evidence, not a claim that all their sources were refreshed.

| Source | Use and outcome |
| --- | --- |
| [Anthropic](https://platform.claude.com/docs/en/models/overview), [OpenAI](https://developers.openai.com/api/docs/models), [Google](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/google-models), [Mistral](https://docs.mistral.ai/models), [Cohere](https://docs.cohere.com/docs/models) | Identity, public capabilities, native IDs and context. New closed weights remain undisclosed. Cohere does publish approximate totals for Embed 5 and Rerank 5. |
| [AWS](https://docs.aws.amazon.com/bedrock/latest/userguide/model-cards.html), [Azure](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure), [Azure partners](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners), [GCP](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-garden/explore-models) | Compare the catalogs with existing mappings. Includes older missing Luma Ray2 and Stability generation models, not just November releases. See the cumulative cloud inventory. |
| [OVHcloud](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/), [public catalog API](https://catalog.endpoints.ai.ovh.net/rest/v1/models_v2), [Scaleway](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) | Observed model families already represented. Add explicitly listed Scaleway deployment/quantization IDs to existing models, not new checkpoints. |
| [LifeArchitect Models Table](https://lifearchitect.ai/models-table/) | The public table loaded in the browser, although direct access to its data feed returned HTTP 403. Read the public total, active, architecture and notes columns. Locked Pro fields and exports were not accessed or reconstructed. See the new numerical rows below. |
| [ApXML](https://apxml.com/models) | Cross-check identity and context. Haiku 5.5, GPT-6.1 Terra, Gemini 4 Argon and Muse Wonder pages say parameters/architecture are undisclosed; they do not corroborate numerical estimates. |
| [models.dev](https://models.dev/api.json), [Ollama](https://ollama.com/library?sort=newest) | Discovery and capability cross-checks, not independent measurements of hidden weights. Hosting aliases, quantization variants and speed tiers are not separate models. |
| Publisher Hugging Face cards and configurations | Verify released artifacts and component counts for Mistral, Moonshot, MiniMax, Qwen, NVIDIA, Meta, Google, Reflection and Liquid AI. Exact per-checkpoint URLs are in the JSON. Gated weights still qualify as open-weight when the publisher offers an actual release under stated access/license terms. |
| [xAI release notes](https://docs.x.ai/developers/release-notes) | Grok 4.7 was already present. Its Fast service is not separate weights. The November image-service retirement does not justify deleting historical records. |

Scope remains canonical and conservative: do not add unannounced LifeArchitect placeholders, arbitrary fine-tunes, Pro effort settings, routers or every model in the Hugging Face/Ollama directories. Gemini 4 Carbon and Muse Wonder Full require separate primary-source identity/availability checks before inclusion; the latter is not silently equated with GCP's Muse Wonder 1.0. Forecasting models such as Timestral would require a schema/task decision. This pass is not a census of all released models worldwide.

## November 2026 LifeArchitect

These rows were read from the public browser table on 2026-11-10. Both numbers are copied from separate columns, not calculated from a total-only estimate. All sizes remain estimates, including MiniMax-M2.7's rounded secondary count. Closed-model architectures remain estimated; MiniMax's MoE architecture is independently established by its publisher configuration.

| Model | Public row | Active | Total |
| --- | --- | ---: | ---: |
| `claude-fable-5.2` | Claude Fable 5.2 | 150 | 10000 |
| `claude-haiku-5.5` | Claude Haiku 5.5 | 15 | 400 |
| `claude-mythos-5.2` | Claude Mythos 5.2 | 150 | 10000 |
| `gemini-4-argon` | Gemini 4 Argon | 150 | 6000 |
| `gpt-6.1-terra` | GPT-6.1 Terra | 75 | 1200 |
| `minimax-m2.7` | MiniMax-M2.7 | 10 | 230 |
| `muse-ember-1.0` | Muse Ember | 8 | 120 |

The source's Terra and Ember notes themselves use price/family assumptions. Their agreement with another price calculation would not be independent confirmation. Anthropic does not disclose Haiku 5.5's weight count. We do not infer the locked training-token or confidence fields from visible ratios. This refresh does not copy EcoLogits numbers into new entries or remove attribution from existing derived values.

## November 2026 Local Hypotheses

No checkpoint-specific published count was verified for the targets below, except the official total counts explicitly identified for Cohere and EmbeddingGemma. These are low-confidence operational proxies, not measurements or claims of shared weights. Public capabilities never come from these proxies. The existing field-level `estimated` schema cannot mark only `parameters.active`, so the whole `parameters` object is flagged when that component is assumed.

| Model | Selected active / total (B) | Scenarios, selection and limits | Numerical anchors |
| --- | ---: | --- | --- |
| `amazon-nova-2.5-sonic` | 24 / 24 | Retain the 24 B previous Nova 2 Sonic family hypothesis. Compare open Voxtral Small's roughly 24 B audio-language core; neither establishes Nova's speech decoder or ancestry. Dense routing is assumed. | Previous Nova 2 Sonic entry; [Voxtral Small](https://huggingface.co/mistralai/Voxtral-Small-24B-2507) |
| `cohere-embed-v5.0-fast` | 1 / 1 | Publisher states an approximate 1 B total. Only the active-equals-total/dense convention is assumed; this is not an independently disclosed active count or routing design. | [Cohere Embed](https://docs.cohere.com/docs/cohere-embed) |
| `cohere-embed-v5.0-pro` | 2.4 / 2.4 | Publisher states an approximate 2.4 B total. Only the active-equals-total/dense convention is assumed; multimodal components may not all execute for a text-only request. | [Cohere Embed](https://docs.cohere.com/docs/cohere-embed) |
| `cohere-rerank-v5.0-fast` | 0.5 / 0.5 | Publisher states an approximate 0.5 B total but describes the architecture as proprietary. Active-equals-total and dense are assumptions, not a parameter estimate inferred from token prices. | [Cohere Rerank](https://docs.cohere.com/docs/rerank) |
| `cohere-rerank-v5.0-pro` | 2 / 2 | Publisher states an approximate 2 B total but describes the architecture as proprietary. Active-equals-total and dense are assumptions; no exposed reasoning API is inferred from reasoning-heavy retrieval benchmarks. | [Cohere Rerank](https://docs.cohere.com/docs/rerank) |
| `embeddinggemma-2` | 0.74 / 0.74 | Official components sum to 0.74 B: text 0.27, vision 0.17, audio 0.30. Dense active-equals-total is an all-component ceiling, not text-only activation: text-only loads 0.27 B. One scalar cannot describe all modality combinations. | [Publisher card](https://huggingface.co/google/embeddinggemma-2) |
| `gemini-4-argon-cyber-permissive` | 150 / 6000 | Officially a version of Argon with changed cybersecurity access and behavior. Use the Argon-size scenario; access policy and reasoning effort are not evidence of a larger or smaller checkpoint. | Argon LifeArchitect row above; [Google variant comparison](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/4-argon) |
| `gemini-nano-banana-2.1` | 25 / 500 | Use the existing Gemini 3.8 Flash 25/500 proxy, not the older image entries' EcoLogits-derived 240/1200. That older scenario is materially larger but does not establish this new image checkpoint's ancestry. No price ratio between image and text units is used. | [Flash row in LifeArchitect](https://lifearchitect.ai/models-table/); [official identity](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/nano-banana-2-1) |
| `gemini-omni-1.2-flash` | 25 / 500 | Retain the Omni 1.1 Flash family proxy anchored to Gemini Flash 25/500. New video-editing features do not establish a weight-count increase. Encoder, codec and audio generation costs are not separately accounted for. | Existing Omni 1.1 hypothesis; [official specifications](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/omni-1-2-flash) |
| `luma-ray-2` | 14 / 14 | Select the published 14 B Wan video backbone as a task analogue. Smaller and larger video generators are plausible; neither Luma's compute claims nor a video price identifies its parameter count or density. | [Wan2.1 T2V 14B](https://huggingface.co/Wan-AI/Wan2.1-T2V-14B) |
| `mistral-ocr-4.1` | 24 / 24 | Retain OCR 4's 24 B hypothesis, with open Mistral Small 3.1 as a vision-language analogue. Bounding boxes and confidence outputs do not prove unchanged weights; Pixtral Large 123 B is a much larger alternative, not the selected anchor. | [Mistral Small 3.1](https://huggingface.co/mistralai/Mistral-Small-3.1-24B-Instruct-2503) |
| `muse-wonder-1.0` | 42 / 816 | Select the public Muse Spark Open 42/816 as a conservative same-vendor analogue, not a documented parent. LifeArchitect lists Muse Wonder Full at 200/4000, about 4.8x larger on both axes; Full has not been verified as the same checkpoint as GCP's Wonder 1.0, so its size is not copied as fact. | [Muse Spark Open](https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B); [LifeArchitect](https://lifearchitect.ai/models-table/) |
| `pegasus-1.5` | 32 / 32 | Retain Pegasus 1.2's intermediate Qwen2.5-VL 32 B analogue. The 7 B and 72 B family members remain useful sensitivity cases; better segmentation and a larger context do not establish a specific weight increase. | [Qwen2.5-VL-32B](https://huggingface.co/Qwen/Qwen2.5-VL-32B-Instruct) |
| `stable-image-core` | 2.6 / 2.6 | Use SDXL's approximately 2.6 B core denoiser as an image-generator analogue. This is not an official identification of Core's pipeline; encoders and hosted preprocessing are excluded. | [SDXL](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0) |
| `stable-image-ultra` | 8 / 8 | Use the published SD3.5 Large 8 B generator as a same-vendor analogue. Ultra is a closed service, not the downloadable checkpoint; extra service components and any routing remain unknown. | [SD3.5 Large](https://huggingface.co/stabilityai/stable-diffusion-3.5-large) |
| `voxtral-mini-transcribe-3` | 4.676 / 4.676 | Borrow the full older Voxtral Mini 3B checkpoint count, including its audio components, rather than treating the marketing 3B as all weights. A new closed version need not retain this architecture or size. | [Voxtral Mini](https://huggingface.co/mistralai/Voxtral-Mini-3B-2507) |
| `voxtral-mini-transcribe-realtime-3` | 4.43 / 4.43 | Use the previous open realtime checkpoint as a proxy. The new version is closed; configurable latency and turn detection do not establish equivalent weights. No token context is invented for the streaming API. | [Voxtral Realtime 2602](https://huggingface.co/mistralai/Voxtral-Mini-4B-Realtime-2602) |
| `voxtral-mini-tts-3` | 4 / 4 | Use the previous open Voxtral 4B TTS checkpoint as a proxy, not as evidence that version 3 is open or unchanged. Character pricing cannot be compared directly with transcription minutes or text-token prices. | [Voxtral TTS 2603](https://huggingface.co/mistralai/Voxtral-4B-TTS-2603) |
| `voxtral-small-transcribe-3` | 24.262 / 24.262 | Use the previous open Voxtral Small checkpoint as a family analogue. It is not a published count for Transcribe 3; the new closed service's functions and modalities come only from its own documentation. | [Voxtral Small](https://huggingface.co/mistralai/Voxtral-Small-24B-2507) |

## November 2026 Component Boundaries

- Mistral Large 4: the vendor reports 52 B active and 1.05 T total, plus a separately described 1.6 B vision encoder. The HF headline rounds the core to 1 T and distinguishes 49 B active excluding embedding/output layers. Keep the vendor's 52/1050 core convention, not 49/1000 or a falsely exact all-component sum.
- Kimi K3.1 Pro: the publisher reports 104/2800, with a separate 0.401 B vision encoder. Do not store the 3T marketing class as an exact total. The AWS Highspeed tier is the same canonical model.
- MiniMax M3 and M3.1 Flash: use the publisher's nominal 23/428. HF's M3.1 packed-storage tensor count is about 220.49 B, including U8-packed low-bit tensors; it is not a count of unpacked learned scalar weights. The model configuration permits 1,048,576 positions; hosted APIs advertise a rounded 1M limit.
- Qwen3.8-2.4T-A95B: 95/2400 and 262,144 native context come from the open checkpoint. The hosted Qwen3.8-Max supports additional modalities and extended context; it is not silently mapped to this text-only checkpoint.
- Qwen3.8-Flash-Next: the publisher lists a 125 B backbone with 6 B active, 51 B n-gram embeddings and 4 B MTP. Store 176 B for backbone plus conditional memory, excluding the optional speculative head, consistent with the existing DeepSeek core-memory convention. `parameters` remains estimated because active memory/vision and exact component boundaries are not fully represented. Native context is 262,144, not the hosted/extended 1M limit.
- Nemotron 3.5 Super VL: keep the publisher's 12/120 and 1,048,576 configuration. It is a hybrid Mamba/attention MoE; `moe` describes sparse routing, not an assertion that every layer is a Transformer. Do not add a separate record for its BF16 and NVFP4 releases.
- Beam: the card's detailed table reports 23.4/501.3, more precise than its 23/501 headline. Liquid LFM3 remains `dense` in this schema because it has no MoE routing; it combines convolution and attention layers.
- Gemma 4 E4B: use the 8 B embedding-inclusive language-model count, not the 4.5 B effective size. Dense active-equals-total is the existing catalog convention; it is not a per-token embedding lookup count. The shared Gemma 4 card also confirms audio input for 12B. Correct medium-model contexts to the 262,144 positions in their configurations.
- GLM-5.3: keep the existing estimated 40/744 pending a complete component-level calculation. LifeArchitect still lists 40/744, ApXML lists about 753.9 B, and HF's artifact metadata counts about 753.33 B including auxiliary/quantization tensors. These do not yet justify calling a raw storage count a replacement architecture measurement.
- DeepSeek-V4.1-Flash-1017 is described by its publisher as a minor update. Keep one canonical record, its previous parameter convention and the dated ID in `providers`; do not create a duplicate for the suffix.
- Nano Banana 2.1 has text/image output and search grounding, but no function calling. `tools: true` includes the documented built-in search. Its hidden width remains absent because no checkpoint-specific width was verified. Do not substitute output resolution for hidden dimension.
- Omni 1.2 Flash emits video with synchronized sound; its documented standalone output modalities are text/video, not an audio-only endpoint. `context` is the 131,072-token input limit, not the output budget. Muse Wonder/Ember contexts likewise record the published input capacity.
- OCR, TTS, Ray2 and Stable Image APIs without a published token window omit `context`; durations, prompt characters and resolution are not token counts. Voxtral 3's published 32k budget is recorded as 32,768; no budget is inferred for its realtime variant.
- Claude Haiku/Fable/Mythos outputs remain text per the vendor, despite Azure tables listing image/code among output modalities. Code is text and image generation through a separate tool is not a native image output.

LFM3's `corpus: 22000` records the publisher's 22 T-token pre-training total, including mid-training, but excluding the separately reported 1.75 T SFT stage and unquantified later training. Other training corpus totals are omitted where no complete, scoped total was verified. In particular, do not add together Nemotron's partial training stages or infer locked LifeArchitect corpus values from ratios.
