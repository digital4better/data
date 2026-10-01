# Cloud Catalog Coverage

Audit date: 2026-10-01. This inventory records each identifier or documentation label found in the inspected public catalog pages, its source, and its disposition. It is not an authenticated regional deployment inventory.

Scope: Bedrock model cards; Azure directly sold and partner model documentation; Google managed Gemini, partner and open-model documentation; OVHcloud AI Endpoints; Scaleway Generative APIs. Arbitrary Hugging Face imports, the entire AWS Marketplace, and every Azure/Google self-deployable community model are not enumerated.

Historical, retired, preview and restricted-access entries are retained. Regional/global inference prefixes and dated snapshots are grouped under canonical models instead of duplicated as model records. A provider reference does not guarantee current access or identical limits on every hosting tier.

| Provider | Observed entries | Linked to a model | Not integrated |
| --- | ---: | ---: | ---: |
| aws | 143 | 130 | 13 |
| azure | 150 | 147 | 3 |
| gcp | 95 | 92 | 3 |
| ovhcloud | 20 | 20 | 0 |
| scaleway | 44 | 44 | 0 |

All identifiable fixed models in this inspected scope are linked below, including models whose hidden size is represented by a [documented local hypothesis](./provenance.md#local-hypotheses). These assumptions do not establish actual parameter counts. Exclusions are service operations, dynamic routers, redundant documentation labels and an ambiguous fine-tuning label. This is exhaustive for the observed pages, not for every cloud marketplace or future release.

`openai.gpt-daybreak-blue-5.6-sol` is grouped under `gpt-5.6-sol`: the [OpenAI Daybreak Blue page](https://developers.openai.com/api/docs/models/gpt-daybreak-blue-latest) names `gpt-5.6-sol` as its snapshot. No separate weight count is inferred from the AWS product name.

The old text-only `ministral-3b` (Azure Ministral-3B / Mistral 2410) is separate from the open vision model `ministral-3-3b` (AWS Ministral 3 3B / Mistral 2512). Similarly, `o1-preview` is not mapped to the later `o1` endpoint.

Context reflects the documented native model limit when available, not necessarily the lower cloud hosting limit. Examples: Palmyra X5 advertises 1M natively versus 128K on its Bedrock card; Grok 4.1 Fast advertises 2M versus smaller Azure/GCP limits. For Marengo/Pegasus and multimodalembedding, context is the text-input limit, not a tokenization of the allowed video duration. Sora 2 is retained as a historical model even though its native API was shut down on 2026-09-24.

## AWS

| Observed identifier | Canonical model or reason not integrated | Evidence |
| --- | --- | --- |
| `ai21.jamba-1-5-large-v1:0` | `jamba-1.5-large` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-ai21-labs-jamba-1-5-large.html) |
| `ai21.jamba-1-5-mini-v1:0` | `jamba-1.5-mini` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-ai21-labs-jamba-1-5-mini.html) |
| `amazon.nova-2-lite-v1:0` | `amazon-nova-2-lite` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-2-lite.html) |
| `amazon.nova-2-multimodal-embeddings-v1:0` | `amazon-nova-multimodal-embeddings` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-amazon-nova-multimodal-embeddings.html) |
| `amazon.nova-2-sonic-v1:0` | `amazon-nova-2-sonic` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-2-sonic.html) |
| `amazon.nova-canvas-v1:0` | `amazon-nova-canvas` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-canvas.html) |
| `amazon.nova-lite-v1:0` | `amazon-nova-lite` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-lite.html) |
| `amazon.nova-micro-v1:0` | `amazon-nova-micro` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-micro.html) |
| `amazon.nova-premier-v1:0` | `amazon-nova-premier` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-premier.html) |
| `amazon.nova-pro-v1:0` | `amazon-nova-pro` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-pro.html) |
| `amazon.nova-reel-v1:0` | `amazon-nova-reel` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-reel.html) |
| `amazon.nova-sonic-v1:0` | `amazon-nova-sonic` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-sonic.html) |
| `amazon.titan-embed-g1-text-02` | `amazon-titan-text-embeddings-v1` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-titan-text-embeddings-v2-2.html) |
| `amazon.titan-embed-image-v1` | `amazon-titan-multimodal-embeddings-g1` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-titan-multimodal-embeddings-g1.html) |
| `amazon.titan-embed-text-v1` | `amazon-titan-text-embeddings-v1` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-titan-embeddings-g1---text.html) |
| `amazon.titan-embed-text-v2:0` | `amazon-titan-text-embeddings-v2` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-titan-text-embeddings-v2.html) |
| `amazon.titan-image-generator-v2:0` | `amazon-titan-image-generator-g1-v2` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-titan-image-generator-g1-v2.html) |
| `anthropic.claude-3-5-haiku-20241022-v1:0` | `claude-3.5-haiku` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-3-5-haiku.html) |
| `anthropic.claude-3-haiku-20240307-v1:0` | `claude-3-haiku` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-3-haiku.html) |
| `anthropic.claude-fable-5` | `claude-fable-5` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-fable-5.html) |
| `anthropic.claude-fable-5-1` | `claude-fable-5.1` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-fable-5-1.html) |
| `anthropic.claude-haiku-4-5` | `claude-haiku-4.5` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-haiku-4-5.html) |
| `anthropic.claude-mythos-5` | `claude-mythos-5` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-mythos-5.html) |
| `anthropic.claude-mythos-5-1` | `claude-mythos-5.1` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-mythos-5-1.html) |
| `anthropic.claude-opus-4-1-20250805-v1:0` | `claude-opus-4.1` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-opus-4-1.html) |
| `anthropic.claude-opus-4-5-20251101-v1:0` | `claude-opus-4.5` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-opus-4-5.html) |
| `anthropic.claude-opus-4-6-v1` | `claude-opus-4.6` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-opus-4-6.html) |
| `anthropic.claude-opus-4-7` | `claude-opus-4.7` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-opus-4-7.html) |
| `anthropic.claude-opus-4-8` | `claude-opus-4.8` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-opus-4-8.html) |
| `anthropic.claude-opus-5` | `claude-opus-5` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-opus-5.html) |
| `anthropic.claude-opus-5-5` | `claude-opus-5.5` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-opus-5-5.html) |
| `anthropic.claude-sonnet-4-20250514-v1:0` | `claude-sonnet-4` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-sonnet-4.html) |
| `anthropic.claude-sonnet-4-5-20250929-v1:0` | `claude-sonnet-4.5` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-sonnet-4-5.html) |
| `anthropic.claude-sonnet-4-6` | `claude-sonnet-4.6` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-sonnet-4-6.html) |
| `anthropic.claude-sonnet-5` | `claude-sonnet-5` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-sonnet-5.html) |
| `anthropic.claude-sonnet-5-5` | `claude-sonnet-5.5` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-sonnet-5-5.html) |
| `cohere.command-r-plus-v1:0` | `cohere-command-r-plus` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-cohere-command-r-plus.html) |
| `cohere.command-r-v1:0` | `cohere-command-r` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-cohere-command-r.html) |
| `cohere.embed-english-v3` | `cohere-embed-english-v3` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-cohere-embed-english.html) |
| `cohere.embed-multilingual-v3` | `cohere-embed-multilingual-3` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-cohere-embed-multilingual.html) |
| `cohere.embed-v4:0` | `cohere-embed-v4` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-cohere-embed-v4.html) |
| `cohere.rerank-v3-5:0` | `cohere-rerank-3.5` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-cohere-rerank-3-5.html) |
| `deepseek.r1-v1:0` | `deepseek-r1` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-deepseek-deepseek-r1.html) |
| `deepseek.v3-v1:0` | `deepseek-v3.1` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-deepseek-deepseek-v3-1.html) |
| `deepseek.v3.1` | `deepseek-v3.1` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-deepseek-deepseek-v3-1.html) |
| `deepseek.v3.2` | `deepseek-v3.2` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-deepseek-deepseek-v3-2.html) |
| `google.gemma-3-12b-it` | `gemma-3-12b-it` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-google-gemma-3-12b-it.html) |
| `google.gemma-3-27b-it` | `gemma-3-27b-it` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-google-gemma-3-27b-pt.html) |
| `google.gemma-3-4b-it` | `gemma-3-4b-it` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-google-gemma-3-4b-it.html) |
| `google.gemma-4-26b-a4b` | `gemma-4-26b-a4b-it` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-google-gemma-4-26b-a4b.html) |
| `google.gemma-4-31b` | `gemma-4-31b-it` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-google-gemma-4-31b.html) |
| `google.gemma-4-e2b` | `gemma-4-e2b-it` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-google-gemma-4-e2b.html) |
| `meta.llama3-1-405b-instruct-v1:0` | `llama-3.1-405b-instruct` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-meta-llama-3-1-405b-instruct.html) |
| `meta.llama3-1-70b-instruct-v1:0` | `llama-3.1-70b-instruct` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-meta-llama-3-1-70b-instruct.html) |
| `meta.llama3-1-8b-instruct-v1:0` | `llama-3.1-8b-instruct` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-meta-llama-3-1-8b-instruct.html) |
| `meta.llama3-2-11b-instruct-v1:0` | `llama-3.2-11b-instruct` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-meta-llama-3-2-11b-instruct.html) |
| `meta.llama3-2-1b-instruct-v1:0` | `llama-3.2-1b-instruct` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-meta-llama-3-2-1b-instruct.html) |
| `meta.llama3-2-3b-instruct-v1:0` | `llama-3.2-3b-instruct` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-meta-llama-3-2-3b-instruct.html) |
| `meta.llama3-2-90b-instruct-v1:0` | `llama-3.2-90b-instruct` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-meta-llama-3-2-90b-instruct.html) |
| `meta.llama3-3-70b-instruct-v1:0` | `llama-3.3-70b-instruct` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-meta-llama-3-3-70b-instruct.html) |
| `meta.llama3-70b-instruct-v1:0` | `llama-3-70b-instruct` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-meta-llama-3-70b-instruct.html) |
| `meta.llama3-8b-instruct-v1:0` | `llama-3-8b-instruct` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-meta-llama-3-8b-instruct.html) |
| `meta.llama4-maverick-17b-instruct-v1:0` | `llama-4-maverick-17b-instruct` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-meta-llama-4-maverick-17b-instruct.html) |
| `meta.llama4-scout-17b-instruct-v1:0` | `llama-4-scout-17b-instruct` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-meta-llama-4-scout-17b-instruct.html) |
| `minimax.minimax-m2` | `minimax-m2` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-minimax-minimax-m2.html) |
| `minimax.minimax-m2.1` | `minimax-m2.1` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-minimax-minimax-m2-1.html) |
| `minimax.minimax-m2.5` | `minimax-m2.5` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-minimax-minimax-m2-5.html) |
| `mistral.devstral-2-123b` | `devstral-2-123b-instruct-2512` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-mistral-ai-devstral-2-123b.html) |
| `mistral.magistral-small-2509` | `magistral-small-2509` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-mistral-ai-magistral-small-2509.html) |
| `mistral.ministral-3-14b-instruct` | `ministral-3-14b` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-mistral-ai-ministral-14b-3-0.html) |
| `mistral.ministral-3-3b-instruct` | `ministral-3-3b` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-mistral-ai-ministral-3b.html) |
| `mistral.ministral-3-8b-instruct` | `ministral-3-8b` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-mistral-ai-ministral-3-8b.html) |
| `mistral.mistral-7b-instruct-v0:2` | `mistral-7b-instruct-v0.2` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-mistral-ai-mistral-7b-instruct.html) |
| `mistral.mistral-large-2402-v1:0` | `mistral-large-2402` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-mistral-ai-mistral-large.html) |
| `mistral.mistral-large-3-675b-instruct` | `mistral-large-3` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-mistral-ai-mistral-large-3.html) |
| `mistral.mistral-small-2402-v1:0` | `mistral-small-2402` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-mistral-ai-mistral-small.html) |
| `mistral.mixtral-8x7b-instruct-v0:1` | `mixtral-8x7b-instruct` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-mistral-ai-mixtral-8x7b-instruct.html) |
| `mistral.pixtral-large-2502-v1:0` | `pixtral-large-25.02` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-mistral-ai-pixtral-large.html) |
| `mistral.voxtral-mini-3b-2507` | `voxtral-mini-3b-2507` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-mistral-ai-voxtral-mini-3b-2507.html) |
| `mistral.voxtral-small-24b-2507` | `voxtral-small-24b-2507` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-mistral-ai-voxtral-small-24b-2507.html) |
| `moonshot.kimi-k2-thinking` | `kimi-k2-thinking` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-moonshot-ai-kimi-k2-thinking.html) |
| `moonshotai.kimi-k2-thinking` | `kimi-k2-thinking` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-moonshot-ai-kimi-k2-thinking.html) |
| `moonshotai.kimi-k2.5` | `kimi-k2.5` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-moonshot-ai-kimi-k2-5.html) |
| `moonshotai.kimi-k3` | `kimi-k3` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-moonshot-ai-kimi-k3.html) |
| `nvidia.nemotron-nano-12b-v2` | `nemotron-nano-12b-v2-vl` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-nvidia-nvidia-nemotron-nano-12b-v2-vl-bf16.html) |
| `nvidia.nemotron-nano-3-30b` | `nemotron-3-nano-30b-a3b` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-nvidia-nemotron-nano-3-30b.html) |
| `nvidia.nemotron-nano-9b-v2` | `nemotron-nano-9b-v2` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-nvidia-nvidia-nemotron-nano-9b-v2.html) |
| `nvidia.nemotron-super-3-120b` | `nemotron-3-super-120b-a12b` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-nvidia-nemotron-super-3-120b.html) |
| `openai.gpt-5.4` | `gpt-5.4` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-openai-gpt-54.html) |
| `openai.gpt-5.5` | `gpt-5.5` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-openai-gpt-55.html) |
| `openai.gpt-5.6-cyber` | `gpt-5.6-cyber` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-openai-gpt-56-cyber.html) |
| `openai.gpt-5.6-luna` | `gpt-5.6-luna` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-openai-gpt-56-luna.html) |
| `openai.gpt-5.6-sol` | `gpt-5.6-sol` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-openai-gpt-56-sol.html) |
| `openai.gpt-5.6-terra` | `gpt-5.6-terra` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-openai-gpt-56-terra.html) |
| `openai.gpt-6-astra` | `gpt-6-astra` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-openai-gpt-6-astra.html) |
| `openai.gpt-6-luna` | `gpt-6-luna` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-openai-gpt-6-luna.html) |
| `openai.gpt-6-sol` | `gpt-6-sol` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-openai-gpt-6-sol.html) |
| `openai.gpt-6.1-sol` | `gpt-6.1-sol` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-openai-gpt-6-1-sol.html) |
| `openai.gpt-daybreak-blue-5.6-sol` | `gpt-5.6-sol` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-openai-gpt-daybreak-blue-56-sol.html) |
| `openai.gpt-oss-120b` | `gpt-oss-120b` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-openai-gpt-oss-120b.html) |
| `openai.gpt-oss-120b-1:0` | `gpt-oss-120b` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-openai-gpt-oss-120b.html) |
| `openai.gpt-oss-20b` | `gpt-oss-20b` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-openai-gpt-oss-20b.html) |
| `openai.gpt-oss-20b-1:0` | `gpt-oss-20b` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-openai-gpt-oss-20b.html) |
| `openai.gpt-oss-safeguard-120b` | `gpt-oss-safeguard-120b` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-openai-gpt-oss-safeguard-120b.html) |
| `openai.gpt-oss-safeguard-20b` | `gpt-oss-safeguard-20b` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-openai-gpt-oss-safeguard-20b.html) |
| `qwen.qwen3-235b-a22b-2507` | `qwen3-235b-a22b-instruct-2507` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-qwen-qwen3-235b-a22b-2507.html) |
| `qwen.qwen3-235b-a22b-2507-v1:0` | `qwen3-235b-a22b-instruct-2507` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-qwen-qwen3-235b-a22b-2507.html) |
| `qwen.qwen3-32b` | `qwen3-32b` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-qwen-qwen3-32b.html) |
| `qwen.qwen3-32b-v1:0` | `qwen3-32b` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-qwen-qwen3-32b.html) |
| `qwen.qwen3-coder-30b-a3b-instruct` | `qwen3-coder-30b-a3b-instruct` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-qwen-qwen3-coder-30b-a3b-instruct.html) |
| `qwen.qwen3-coder-30b-a3b-v1:0` | `qwen3-coder-30b-a3b-instruct` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-qwen-qwen3-coder-30b-a3b-instruct.html) |
| `qwen.qwen3-coder-480b-a35b-instruct` | `qwen3-coder-480b-a35b-instruct` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-qwen-qwen3-coder-480b-a35b-instruct.html) |
| `qwen.qwen3-coder-480b-a35b-v1:0` | `qwen3-coder-480b-a35b-instruct` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-qwen-qwen3-coder-480b-a35b-instruct.html) |
| `qwen.qwen3-coder-next` | `qwen3-coder-next` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-qwen-qwen3-coder-next.html) |
| `qwen.qwen3-next-80b-a3b` | `qwen3-next-instruct-80b` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-qwen-qwen3-next-80b-a3b.html) |
| `qwen.qwen3-next-80b-a3b-instruct` | `qwen3-next-instruct-80b` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-qwen-qwen3-next-80b-a3b.html) |
| `qwen.qwen3-vl-235b-a22b` | `qwen3-vl-235b-a22b-instruct` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-qwen-qwen3-vl-235b-a22b.html) |
| `qwen.qwen3-vl-235b-a22b-instruct` | `qwen3-vl-235b-a22b-instruct` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-qwen-qwen3-vl-235b-a22b.html) |
| `stability.stable-conservative-upscale-v1:0` | Image editing/upscaling service; no independently documented standalone weights | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-stability-ai-stable-image-conservative-upscale.html) |
| `stability.stable-creative-upscale-v1:0` | Image editing/upscaling service; no independently documented standalone weights | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-stability-ai-stable-image-creative-upscale.html) |
| `stability.stable-fast-upscale-v1:0` | Image editing/upscaling service; no independently documented standalone weights | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-stability-ai-stable-image-fast-upscale.html) |
| `stability.stable-image-control-sketch-v1:0` | Image editing/upscaling service; no independently documented standalone weights | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-stability-ai-stable-image-control-sketch.html) |
| `stability.stable-image-control-structure-v1:0` | Image editing/upscaling service; no independently documented standalone weights | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-stability-ai-stable-image-control-structure.html) |
| `stability.stable-image-erase-object-v1:0` | Image editing/upscaling service; no independently documented standalone weights | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-stability-ai-stable-image-erase-object.html) |
| `stability.stable-image-inpaint-v1:0` | Image editing/upscaling service; no independently documented standalone weights | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-stability-ai-stable-image-inpaint.html) |
| `stability.stable-image-remove-background-v1:0` | Image editing/upscaling service; no independently documented standalone weights | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-stability-ai-stable-image-remove-background.html) |
| `stability.stable-image-search-recolor-v1:0` | Image editing/upscaling service; no independently documented standalone weights | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-stability-ai-stable-image-search-and-recolor.html) |
| `stability.stable-image-search-replace-v1:0` | Image editing/upscaling service; no independently documented standalone weights | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-stability-ai-stable-image-search-and-replace.html) |
| `stability.stable-image-style-guide-v1:0` | Image editing/upscaling service; no independently documented standalone weights | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-stability-ai-stable-image-style-guide.html) |
| `stability.stable-outpaint-v1:0` | Image editing/upscaling service; no independently documented standalone weights | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-stability-ai-stable-image-outpaint.html) |
| `stability.stable-style-transfer-v1:0` | Image editing/upscaling service; no independently documented standalone weights | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-stability-ai-stable-image-style-transfer.html) |
| `twelvelabs.marengo-embed-2-7-v1:0` | `marengo-embed-2.7` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-twelvelabs-marengo-embed-v2-7.html) |
| `twelvelabs.marengo-embed-3-0-v1:0` | `marengo-embed-3.0` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-twelvelabs-marengo-embed-3-0.html) |
| `twelvelabs.pegasus-1-2-v1:0` | `pegasus-1.2` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-twelvelabs-pegasus-v1-2.html) |
| `writer.palmyra-vision-7b` | `palmyra-vision-7b` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-writer-palmyra-vision-7b.html) |
| `writer.palmyra-x4-v1:0` | `palmyra-x4` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-writer-palmyra-x4.html) |
| `writer.palmyra-x5-v1:0` | `palmyra-x5` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-writer-palmyra-x5.html) |
| `xai.grok-4.3` | `grok-4.3` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-xai-grok-4-3.html) |
| `xai.grok-4.6` | `grok-4.6` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-xai-grok-4-6.html) |
| `xai.grok-4.7` | `grok-4.7` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-xai-grok-4-7.html) |
| `zai.glm-4.7` | `glm-4.7` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-zai-glm-4-7.html) |
| `zai.glm-4.7-flash` | `glm-4.7-flash` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-zai-glm-4-7-flash.html) |
| `zai.glm-5` | `glm-5` | [Official source](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-zai-glm-5.html) |

## AZURE

| Observed identifier | Canonical model or reason not integrated | Evidence |
| --- | --- | --- |
| `claude-fable-5` | `claude-fable-5` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `claude-fable-5-1` | `claude-fable-5.1` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `claude-haiku-4-5` | `claude-haiku-4.5` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `claude-mythos-5` | `claude-mythos-5` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `claude-mythos-5-1` | `claude-mythos-5.1` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `claude-mythos-preview` | `claude-mythos-preview` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `claude-opus-4-5` | `claude-opus-4.5` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `claude-opus-4-6` | `claude-opus-4.6` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `claude-opus-4-7` | `claude-opus-4.7` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `claude-opus-4-8` | `claude-opus-4.8` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `claude-opus-5` | `claude-opus-5` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `claude-opus-5-5` | `claude-opus-5.5` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `claude-sonnet-4-5` | `claude-sonnet-4.5` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `claude-sonnet-4-6` | `claude-sonnet-4.6` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `claude-sonnet-5` | `claude-sonnet-5` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `claude-sonnet-5-5` | `claude-sonnet-5.5` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `Codestral-2501` | `codestral-2` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `codex-mini` | `codex-mini` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `Cohere-command-a` | `cohere-command-a` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `Cohere-command-a-plus-05-2026` | `cohere-command-a-plus` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `Cohere-embed-v3-english` | `cohere-embed-english-v3` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `Cohere-embed-v3-multilingual` | `cohere-embed-multilingual-3` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `Cohere-parse-v5` | `cohere-parse-v5` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `Cohere-rerank-v4.0-fast` | `cohere-rerank-v4.0-fast` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `Cohere-rerank-v4.0-pro` | `cohere-rerank-v4.0-pro` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `computer-use-preview` | `computer-use-preview` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `DeepSeek-V3.2` | `deepseek-v3.2` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `DeepSeek-V3.2-Speciale` | `deepseek-v3.2-speciale` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `DeepSeek-V4-Flash` | `deepseek-v4-flash` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `DeepSeek-V4-Flash-0731` | `deepseek-v4-flash` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `DeepSeek-V4-Pro` | `deepseek-v4-pro` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `embed-v-4-0` | `cohere-embed-v4` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `FLUX-1.1-pro` | `flux-1.1-pro` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `FLUX.1-Kontext-pro` | `flux-1-kontext-pro` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `FLUX.2-flex` | `flux-2-flex` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `FLUX.2-pro` | `flux-2-pro` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-4` | `gpt-4` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-4.1` | `gpt-4.1` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-4.1-mini` | `gpt-4.1-mini` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-4.1-nano` | `gpt-4.1-nano` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-4o` | `gpt-4o` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-4o-audio-preview` | `gpt-4o-audio` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-4o-mini` | `gpt-4o-mini` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-4o-mini-audio-preview` | `gpt-4o-mini-audio` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-4o-mini-realtime-preview` | `gpt-4o-mini-realtime` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-4o-mini-transcribe` | `gpt-4o-mini-transcribe` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-4o-mini-tts` | `gpt-4o-mini-tts` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-4o-realtime-preview` | `gpt-4o-realtime` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-4o-transcribe` | `gpt-4o-transcribe` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-4o-transcribe-diarize` | `gpt-4o-transcribe-diarize` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5` | `gpt-5` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5-chat` | `gpt-5-chat` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5-codex` | `gpt-5-codex` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5-mini` | `gpt-5-mini` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5-nano` | `gpt-5-nano` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5-pro` | `gpt-5-pro` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5.1` | `gpt-5.1` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5.1-chat` | `gpt-5.1-chat` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5.1-codex` | `gpt-5.1-codex` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5.1-codex-max` | `gpt-5.1-codex-max` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5.1-codex-mini` | `gpt-5.1-codex-mini` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5.2` | `gpt-5.2` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5.2-chat` | `gpt-5.2-chat` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5.2-codex` | `gpt-5.2-codex` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5.3-chat` | `gpt-5.3-chat` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5.3-codex` | `gpt-5.3-codex` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5.4` | `gpt-5.4` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5.4-mini` | `gpt-5.4-mini` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5.4-nano` | `gpt-5.4-nano` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5.4-pro` | `gpt-5.4-pro` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5.5` | `gpt-5.5` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5.6-luna` | `gpt-5.6-luna` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5.6-sol` | `gpt-5.6-sol` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-5.6-terra` | `gpt-5.6-terra` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-6-astra` | `gpt-6-astra` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-6-luna` | `gpt-6-luna` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-6-sol` | `gpt-6-sol` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-6.1-sol` | `gpt-6.1-sol` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-audio` | `gpt-audio` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-audio-1.5` | `gpt-audio-1.5` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-chat-latest` | Dynamic router, not a fixed model | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-image-1` | `gpt-image-1` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-image-1-mini` | `gpt-image-1-mini` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-image-1.5` | `gpt-image-1.5` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-image-2` | `gpt-image-2` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-image-2.5-flare` | `gpt-image-2.5-flare` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-image-2.5-sunburst` | `gpt-image-2.5-sunburst` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-live-transcribe` | `gpt-live-transcribe` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-oss-120b` | `gpt-oss-120b` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-oss-20b` | `gpt-oss-20b` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-realtime` | `gpt-realtime` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-realtime-1.5` | `gpt-realtime-1.5` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-realtime-2` | `gpt-realtime-2` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-realtime-2.1` | `gpt-realtime-2.1` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-realtime-translate` | `gpt-realtime-translate` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-realtime-whisper` | `gpt-realtime-whisper` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `gpt-transcribe` | `gpt-transcribe` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `grok-4` | `grok-4` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `grok-4-20-non-reasoning` | `grok-4.20-non-reasoning` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `grok-4-20-reasoning` | `grok-4.20-reasoning` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `grok-4.1-fast-non-reasoning` | `grok-4.1-fast-non-reasoning` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `grok-4.1-fast-reasoning` | `grok-4.1-fast-reasoning` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `grok-4.3` | `grok-4.3` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `grok-4.6` | `grok-4.6` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `grok-code-fast-1` | `grok-code-fast-1` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `Kimi-K2.5` | `kimi-k2.5` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `Kimi-K2.6` | `kimi-k2.6` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `Kimi-K2.7-Code` | `kimi-k2.7-code` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `Llama-3.3-70B-Instruct` | `llama-3.3-70b-instruct` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `Llama-4-Maverick-17B-128E-Instruct-FP8` | `llama-4-maverick-17b-instruct` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `Llama-4-Scout-17B-16E-Instruct` | `llama-4-scout-17b-instruct` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `MAI-Image-2.5` | `mai-image-2.5` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `MAI-Image-2.5-Flash` | `mai-image-2.5-flash` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `MAI-Image-2.5-Pro` | `mai-image-2.5-pro` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `MAI-Image-2.6` | `mai-image-2.6` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `MAI-Image-2.6-Flash` | `mai-image-2.6-flash` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `MAI-Thinking-1` | `mai-thinking-1` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `Ministral-3B` | `ministral-3b` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `mistral-document-ai-2512` | `mistral-document-ai-2512` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `Mistral-Large-3` | `mistral-large-3` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `Mistral-medium-2505` | `mistral-medium-3` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `mistral-medium-3-5` | `mistral-medium-3.5` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `mistral-ocr-4-0` | `mistral-ocr-4` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `Mistral-small-2503` | `mistral-small-3.1-24b-instruct-2503` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `mistralai-Mistral-7B-Instruct-v0-2` | `mistral-7b-instruct-v0.2` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `mistralai-Mistral-7B-Instruct-v01` | `mistral-7b-instruct-v0.1` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `mistralai-Mixtral-8x22B-Instruct-v0-1` | `mixtral-8x22b-instruct` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `mistralai-Mixtral-8x7B-Instruct-v01` | `mixtral-8x7b-instruct` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `model-router` | Dynamic router, not a fixed model | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `o1` | `o1` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `o1-mini` | `o1-mini` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `o1-preview` | `o1-preview` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `o3` | `o3` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `o3-mini` | `o3-mini` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `o3-pro` | `o3-pro` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `o4-mini` | `o4-mini` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `Phi-4` | `phi-4` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `Phi-4-mini-instruct` | `phi-4-mini` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `Phi-4-mini-reasoning` | `phi-4-mini-reasoning` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `Phi-4-multimodal-instruct` | `phi-4-mini-multimodal` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `Phi-4-reasoning` | `phi-4-reasoning` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `Qwen-32B` | Fine-tuning label only; ambiguous canonical model | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `sora-2` | `sora-2` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `text-embedding-3-large` | `text-embedding-3` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `text-embedding-3-small` | `text-embedding-3-small` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `text-embedding-ada-002` | `embedding-ada` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `tsuzumi-7b` | `tsuzumi-7b` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-from-partners) |
| `tts` | `tts-1` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `tts-hd` | `tts-1-hd` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |
| `whisper` | `whisper-1` | [Official source](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) |

## GCP

| Observed identifier | Canonical model or reason not integrated | Evidence |
| --- | --- | --- |
| `claude-3-5-sonnet` | `claude-3.5-sonnet` | [Official source](https://console.cloud.google.com/agent-platform/publishers/anthropic/model-garden/claude-3-5-sonnet) |
| `claude-3-5-sonnet-v2` | `claude-3.5-sonnet-v2` | [Official source](https://console.cloud.google.com/agent-platform/publishers/anthropic/model-garden/claude-3-5-sonnet-v2) |
| `claude-fable-5` | `claude-fable-5` | [Official source](https://console.cloud.google.com/agent-platform/publishers/anthropic/model-garden/claude-fable-5) |
| `claude-fable-5-1` | `claude-fable-5.1` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/claude/fable-5-1) |
| `claude-haiku-4-5` | `claude-haiku-4.5` | [Official source](https://console.cloud.google.com/agent-platform/publishers/anthropic/model-garden/claude-haiku-4-5) |
| `claude-opus-4` | `claude-opus-4` | [Official source](https://console.cloud.google.com/agent-platform/publishers/anthropic/model-garden/claude-opus-4) |
| `claude-opus-4-1` | `claude-opus-4.1` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/claude/opus-4-1) |
| `claude-opus-4-5` | `claude-opus-4.5` | [Official source](https://console.cloud.google.com/agent-platform/publishers/anthropic/model-garden/claude-opus-4-5) |
| `claude-opus-4-6` | `claude-opus-4.6` | [Official source](https://console.cloud.google.com/agent-platform/publishers/anthropic/model-garden/claude-opus-4-6) |
| `claude-opus-4-7` | `claude-opus-4.7` | [Official source](https://console.cloud.google.com/agent-platform/publishers/anthropic/model-garden/claude-opus-4-7) |
| `claude-opus-4-8` | `claude-opus-4.8` | [Official source](https://console.cloud.google.com/agent-platform/publishers/anthropic/model-garden/claude-opus-4-8) |
| `claude-opus-5` | `claude-opus-5` | [Official source](https://console.cloud.google.com/agent-platform/publishers/anthropic/model-garden/claude-opus-5) |
| `claude-opus-5-5` | `claude-opus-5.5` | [Official source](https://console.cloud.google.com/agent-platform/publishers/anthropic/model-garden/claude-opus-5-5) |
| `claude-sonnet-4` | `claude-sonnet-4` | [Official source](https://console.cloud.google.com/agent-platform/publishers/anthropic/model-garden/claude-sonnet-4) |
| `claude-sonnet-4-5` | `claude-sonnet-4.5` | [Official source](https://console.cloud.google.com/agent-platform/publishers/anthropic/model-garden/claude-sonnet-4-5) |
| `claude-sonnet-4-6` | `claude-sonnet-4.6` | [Official source](https://console.cloud.google.com/agent-platform/publishers/anthropic/model-garden/claude-sonnet-4-6) |
| `claude-sonnet-5` | `claude-sonnet-5` | [Official source](https://console.cloud.google.com/agent-platform/publishers/anthropic/model-garden/claude-sonnet-5) |
| `claude-sonnet-5-5` | `claude-sonnet-5.5` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/claude/sonnet-5-5) |
| `codestral-2` | `codestral-2` | [Official source](https://console.cloud.google.com/agent-platform/publishers/mistralai/model-garden/codestral-2) |
| `DeepSeek-OCR` | Documentation version label; the separately listed -maas identifier is the API model ID | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/deepseek/deepseek-ocr) |
| `deepseek-ocr-maas` | `deepseek-ocr` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/deepseek) |
| `deepseek-r1-0528-maas` | `deepseek-r1-0528` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/deepseek) |
| `deepseek-v3.1-maas` | `deepseek-v3.1` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/deepseek) |
| `deepseek-v3.2-maas` | `deepseek-v3.2` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/deepseek) |
| `gemini-2.5-flash` | `gemini-2.5-flash` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/2-5-flash) |
| `gemini-2.5-flash-image` | `gemini-2.5-flash-image` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/2-5-flash-image) |
| `gemini-2.5-flash-lite` | `gemini-2.5-flash-lite` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/2-5-flash-lite) |
| `gemini-2.5-pro` | `gemini-2.5-pro` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/2-5-pro) |
| `gemini-3-flash-preview` | `gemini-3-flash` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-flash) |
| `gemini-3-pro-image` | `gemini-3-pro-image` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-pro-image) |
| `gemini-3-pro-image-preview` | `gemini-3-pro-image` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-pro-image-preview) |
| `gemini-3.1-flash-image` | `gemini-3.1-flash-image` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-1-flash-image) |
| `gemini-3.1-flash-image-preview` | `gemini-3.1-flash-image` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-pro-image-preview) |
| `gemini-3.1-flash-lite` | `gemini-3.1-flash-lite` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-1-flash-lite) |
| `gemini-3.1-flash-lite-image` | `gemini-3.1-flash-lite-image` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-1-flash-lite-image) |
| `gemini-3.1-pro-preview` | `gemini-3.1-pro` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-1-pro) |
| `gemini-3.1-pro-preview-customtools` | `gemini-3.1-pro` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-1-pro) |
| `gemini-3.5-flash` | `gemini-3.5-flash` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-5-flash) |
| `gemini-3.5-flash-lite` | `gemini-3.5-flash-lite` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-5-flash-lite) |
| `gemini-3.5-live-translate-preview` | `gemini-3.5-live-translate` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-5-live-translate) |
| `gemini-3.5-transcribe-live-preview` | `gemini-3.5-transcribe` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-5-transcribe) |
| `gemini-3.5-transcribe-preview` | `gemini-3.5-transcribe` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-5-transcribe) |
| `gemini-3.6-flash` | `gemini-3.6-flash` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-6-flash) |
| `gemini-3.7-flash` | `gemini-3.7-flash` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-7-flash) |
| `gemini-3.8-flash` | `gemini-3.8-flash` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-8-flash) |
| `gemini-3.8-flash-cyber` | `gemini-3.8-flash-cyber` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-8-flash-cyber) |
| `gemini-3.8-live` | `gemini-3.8-live` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-8-live) |
| `gemini-embedding-001` | `gemini-embedding-001` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/embeddings/get-text-embeddings) |
| `gemini-embedding-2` | `gemini-embedding-2` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/embedding-2) |
| `gemini-embedding-2-preview` | `gemini-embedding-2` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/embedding-2) |
| `gemini-live-2.5-flash-native-audio` | `gemini-2.5-flash-live-api` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/2-5-flash-live-api) |
| `gemini-omni-1.1-flash-preview` | `gemini-omni-1.1-flash` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/omni-1-1-flash) |
| `gemini-omni-flash-preview` | `gemini-omni-flash` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/omni-flash-preview) |
| `gemma-4-26b-a4b-it-maas` | `gemma-4-26b-a4b-it` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/google) |
| `glm-4.7-maas` | `glm-4.7` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/zaiorg) |
| `glm-5-maas` | `glm-5` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/zaiorg) |
| `glm-5.2-maas` | `glm-5.2` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/zaiorg) |
| `gpt-oss-120b-maas` | `gpt-oss-120b` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/openai) |
| `gpt-oss-20b-maas` | `gpt-oss-20b` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/openai) |
| `grok-4.1-fast-non-reasoning` | `grok-4.1-fast-non-reasoning` | [Official source](https://console.cloud.google.com/agent-platform/publishers/xai/model-garden/grok-4.1-fast-non-reasoning) |
| `grok-4.1-fast-reasoning` | `grok-4.1-fast-reasoning` | [Official source](https://console.cloud.google.com/agent-platform/publishers/xai/model-garden/grok-4.1-fast-reasoning) |
| `grok-4.20-non-reasoning` | `grok-4.20-non-reasoning` | [Official source](https://console.cloud.google.com/agent-platform/publishers/xai/model-garden/grok-4.20-non-reasoning) |
| `grok-4.20-reasoning` | `grok-4.20-reasoning` | [Official source](https://console.cloud.google.com/agent-platform/publishers/xai/model-garden/grok-4.20-reasoning) |
| `grok-4.3` | `grok-4.3` | [Official source](https://console.cloud.google.com/agent-platform/publishers/xai/model-garden/grok-4.3) |
| `grok-4.6` | `grok-4.6` | [Official source](https://console.cloud.google.com/agent-platform/publishers/xai/model-garden/grok-4.6) |
| `grok-4.7` | `grok-4.7` | [Official source](https://console.cloud.google.com/agent-platform/publishers/xai/model-garden/grok-4.7) |
| `jamba-1.5-large` | `jamba-1.5-large` | [Official source](https://console.cloud.google.com/agent-platform/publishers/ai21/model-garden/jamba-1.5-large) |
| `jamba-1.5-mini` | `jamba-1.5-mini` | [Official source](https://console.cloud.google.com/agent-platform/publishers/ai21/model-garden/jamba-1.5-mini) |
| `kimi-k2-thinking-maas` | `kimi-k2-thinking` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/kimi) |
| `llama-3.3-70b-instruct-maas` | `llama-3.3-70b-instruct` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/llama/llama3-3) |
| `llama-4-maverick-17b-128e-instruct-maas` | `llama-4-maverick-17b-instruct` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/llama/llama4-maverick) |
| `llama-4-scout-17b-16e-instruct-maas` | `llama-4-scout-17b-instruct` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/llama/llama4-scout) |
| `lyria-002` | `lyria-002` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/lyria/lyria-002) |
| `lyria-3-clip-preview` | `lyria-3-clip` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/lyria/lyria-3#lyria-3-pro-preview) |
| `lyria-3-pro-preview` | `lyria-3-pro` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/lyria/lyria-3#lyria-3-pro-preview) |
| `meta/muse-spark-1.3` | `muse-spark-1.3` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/meta/muse-spark-1-3) |
| `mistral-medium-3` | `mistral-medium-3` | [Official source](https://console.cloud.google.com/agent-platform/publishers/mistralai/model-garden/mistral-medium-3) |
| `mistral-ocr-2505` | `mistral-ocr-2505` | [Official source](https://console.cloud.google.com/agent-platform/publishers/mistralai/model-garden/mistral-ocr-2505) |
| `mistral-small-2503` | `mistral-small-3.1-24b-instruct-2503` | [Official source](https://console.cloud.google.com/agent-platform/publishers/mistralai/model-garden/mistral-small-2503) |
| `multilingual-e5-large` | Documentation version label; the separately listed -maas identifier is the API model ID | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/e5/multilingual-e5-large) |
| `multilingual-e5-large-instruct-maas` | `multilingual-e5-large-instruct` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/e5/multilingual-e5-large) |
| `multilingual-e5-small` | Documentation version label; the separately listed -maas identifier is the API model ID | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/e5/multilingual-e5-small) |
| `multilingual-e5-small-maas` | `multilingual-e5-small` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/e5/multilingual-e5-small) |
| `multimodalembedding@001` | `multimodalembedding-001` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/embeddings/get-multimodal-embeddings) |
| `qwen3-235b-a22b-instruct-2507-maas` | `qwen3-235b-a22b-instruct-2507` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/qwen/qwen3-235b) |
| `qwen3-coder-480b-a35b-instruct-maas` | `qwen3-coder-480b-a35b-instruct` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/qwen/qwen3-coder) |
| `qwen3-next-80b-a3b-instruct-maas` | `qwen3-next-instruct-80b` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/qwen/qwen3-next-instruct) |
| `qwen3-next-80b-a3b-thinking-maas` | `qwen3-next-thinking-80b` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/qwen/qwen3-next-thinking) |
| `text-embedding-005` | `text-embedding-005` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/embeddings/get-text-embeddings) |
| `text-multilingual-embedding-002` | `text-multilingual-embedding-002` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/embeddings/get-text-embeddings) |
| `veo-3.0-fast-generate-001` | `veo-3.0-fast` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-0-generate#3.0-generate-001) |
| `veo-3.0-generate-001` | `veo-3.0` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-0-generate#3.0-generate-001) |
| `veo-3.1-fast-generate-001` | `veo-3.1-fast` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-0-generate#3.0-generate-001) |
| `veo-3.1-generate-001` | `veo-3.1` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-0-generate#3.0-generate-001) |
| `veo-3.1-lite-generate-001` | `veo-3.1-lite` | [Official source](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-1-generate#3.1-generate-001) |

## OVHCLOUD

| Observed identifier | Canonical model or reason not integrated | Evidence |
| --- | --- | --- |
| `bge-m3` | `bge-m3` | [Official source](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/) |
| `bge-multilingual-gemma2` | `bge-multilingual-gemma2` | [Official source](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/) |
| `gpt-oss-120b` | `gpt-oss-120b` | [Official source](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/) |
| `gpt-oss-20b` | `gpt-oss-20b` | [Official source](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/) |
| `Meta-Llama-3_3-70B-Instruct` | `llama-3.3-70b-instruct` | [Official source](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/) |
| `nvr-tts-de-de` | `nvr-tts-de-de` | [Official source](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/) |
| `nvr-tts-en-us` | `nvr-tts-en-us` | [Official source](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/) |
| `nvr-tts-es-es` | `nvr-tts-es-es` | [Official source](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/) |
| `nvr-tts-it-it` | `nvr-tts-it-it` | [Official source](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/) |
| `Qwen2.5-VL-72B-Instruct` | `qwen2.5-vl-72b-instruct` | [Official source](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/) |
| `Qwen3-Embedding-8B` | `qwen3-embedding-8b` | [Official source](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/) |
| `Qwen3.5-397B-A17B` | `qwen3.5-397b-a17b` | [Official source](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/) |
| `Qwen3.5-9B` | `qwen3.5-9b` | [Official source](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/) |
| `Qwen3.6-27B` | `qwen3.6-27b` | [Official source](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/) |
| `Qwen3.8-27B` | `qwen3.8-27b` | [Official source](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/) |
| `Qwen3Guard-Gen-0.6B` | `qwen-guard-gen-0.6b` | [Official source](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/) |
| `Qwen3Guard-Gen-8B` | `qwen-guard-gen-8b` | [Official source](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/) |
| `stable-diffusion-xl-base-v10` | `stable-diffusion-xl-base-v1.0` | [Official source](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/) |
| `whisper-large-v3` | `whisper-large-v3` | [Official source](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/) |
| `whisper-large-v3-turbo` | `whisper-large-v3-turbo` | [Official source](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/) |

## SCALEWAY

| Observed identifier | Canonical model or reason not integrated | Evidence |
| --- | --- | --- |
| `bge-multilingual-gemma2` | `bge-multilingual-gemma2` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `deepseek-r1-distill-llama-70b` | `deepseek-r1-distill-llama-70b` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `deepseek-r1-distill-llama-8b` | `deepseek-r1-distill-llama-8b` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `deepseek-v4-flash-0731` | `deepseek-v4-flash` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `devstral-2-123b-instruct-2512` | `devstral-2-123b-instruct-2512` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `devstral-small-2505` | `devstral-small-2505` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `gemma-3-27b-it` | `gemma-3-27b-it` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `gemma-4-26b-a4b-it` | `gemma-4-26b-a4b-it` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `gemma-4-31b-it` | `gemma-4-31b-it` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `glm-5.2` | `glm-5.2` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `gpt-oss-120b` | `gpt-oss-120b` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `gpt-oss-20b` | `gpt-oss-20b` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `holo2-30b-a3b` | `holo2-30b-a3b` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `llama-3-70b-instruct` | `llama-3-70b-instruct` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `llama-3-8b-instruct` | `llama-3-8b-instruct` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `llama-3.1-70b-instruct` | `llama-3.1-70b-instruct` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `llama-3.1-8b-instruct` | `llama-3.1-8b-instruct` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `llama-3.1-nemotron-70b-instruct` | `llama-3.1-nemotron-70b-instruct` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `llama-3.3-70b-instruct` | `llama-3.3-70b-instruct` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `magistral-small-2506` | `magistral-small-2506` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `minimax-m2.5` | `minimax-m2.5` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `mistral-7b-instruct-v0.3` | `mistral-7b-instruct-v0.3` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `mistral-large-3-675b-instruct-2512` | `mistral-large-3` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `mistral-medium-3.5-128b` | `mistral-medium-3.5` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `mistral-nemo-instruct-2407` | `mistral-nemo-instruct-2407` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `mistral-small-24b-instruct-2501` | `mistral-small-3` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `mistral-small-3.1-24b-instruct-2503` | `mistral-small-3.1` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `mistral-small-3.2-24b-instruct-2506` | `mistral-small-3.2-24b` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `mixtral-8x7b-instruct-v0.1` | `mixtral-8x7b-instruct` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `molmo-72b-0924` | `molmo-72b` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `pixtral-12b-2409` | `pixtral-12b-2409` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `qwen2.5-coder-32b-instruct` | `qwen2.5-coder-32b-instruct` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `qwen3-235b-a22b-instruct-2507` | `qwen3-235b-a22b-instruct-2507` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `qwen3-235b-a22b-thinking-2507` | `qwen3-235b-a22b-thinking` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `qwen3-coder-30b-a3b-instruct` | `qwen3-coder-30b-a3b-instruct` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `qwen3-embedding-8b` | `qwen3-embedding-8b` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `qwen3.5-122b-a10b` | `qwen3.5-122b-a10b` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `qwen3.5-35b-a3b` | `qwen3.5-35b-a3b` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `qwen3.5-397b-a17b` | `qwen3.5-397b-a17b` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `qwen3.6-35b-a3b` | `qwen3.6-35b-a3b` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `qwen3.8-27b` | `qwen3.8-27b` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `sentence-t5-xxl` | `sentence-t5-xxl` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `voxtral-small-24b-2507` | `voxtral-small-24b-2507` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
| `whisper-large-v3` | `whisper-large-v3` | [Official source](https://www.scaleway.com/en/docs/generative-apis/reference-content/supported-models/) |
