# Source Evidence

The AI/cloud registry and its guide are published metadata. The cloud calculation evidence and historical electricity snapshot below remain repository-only maintenance inputs.

## AI and cloud source registry

[catalog.json](./catalog.json) is the single source registry for AI and the six cloud providers. Read it at the same commit as the datasets. [catalog.schema.json](./catalog.schema.json) defines its version 2 structure. The registry is published in npm and under the website's `sources/` download path; it is metadata, not an additional editorial collection.

### Source identity and evidence

Each source has a stable `id`, a human-readable `name`, URL, publisher, provider `scopes`, subject `topics`, attribution and known limitations. `category` describes evidence origin: `primary`, `secondary`, `observation` or `methodology`. It is independent of the source's role in collection:

| Role          | Use                                                      | Required on every full pass?                        |
| ------------- | -------------------------------------------------------- | --------------------------------------------------- |
| `catalog`     | Authoritative inventory, specifications or metric tables | Yes, including declared pagination and linked pages |
| `discovery`   | Index or reporting entry point used to find new material | Yes, including declared searches                    |
| `reference`   | Evidence for an individual record or field               | When used to justify a proposal                     |
| `methodology` | Calculation method, estimate or interpretation           | When used to justify a proposal                     |

`active` means retained for use, not recently verified or guaranteed reachable. `deprecated` preserves the source and its history, with a reason and optional replacement ID. Deprecation requires positive evidence of withdrawal or replacement, or confirmed disappearance; a timeout, HTTP error or bot challenge is insufficient. When consolidating duplicate or moved URLs, keep the previous entry and link it to the preferred source. Do not delete historical records supported by it.

Imported references are not automatically primary evidence. For example, model aggregators are secondary; a model hosted on Hugging Face is attributed to its namespace, whose official ownership still needs verification. Preserve original publisher licensing and record-level attribution, including EcoLogits and Samuel Rince where applicable. Listing a source does not relicense it.

### Declared coverage

The root `coverage` matrix explicitly maps every required scope/topic pair to active catalog or discovery IDs. AI requires `models` and hosted `availability`. AWS, Azure, GCP, Oracle, OVHcloud and Scaleway each require `instances`, `regions`, `sustainability` and `hardware`. A source can support several topics; a provider-specific URL must not inherit all providers merely because it appeared in a shared README.

A complete pass visits every active catalog/discovery source and its declared searches. References and methodologies are fetched when needed for evidence, so an unused old reference cannot block a full run. Missing access to a required source, unresolved pagination, missing expected content or an interrupted traversal makes coverage incomplete and blocks a data PR. Completeness covers this declared contract, not all publishers, all products or the entire Internet. Newly found sources can be proposed as references; expanding mandatory coverage is an explicit reviewed registry change.

### Collection contract

`collection` is declarative, with no scripts or executable expressions:

- `method`: `http` for structured text, APIs and PDFs; `browser` for rendered HTML.
- `pagination`: `none` for a reviewed single-page inventory, `link` for an explicit next-page CSS selector in `next`, or `json` for a dotted response-property path in `next`. JSON pagination ends only with null or an empty string; a missing property is a contract failure. `unreviewed` is reserved for references whose traversal has not been curated.
- `follow`: absolute URL prefixes for linked detail pages that must also be read, recursively, with URL deduplication. An empty list means no automatic detail-page expansion. This is separate from pagination. All destinations still require network safety checks.
- `expect`: case-insensitive text markers expected in the root page. Required text catalogs need non-empty markers so a cookie notice or script shell is not mistaken for the catalog. PDFs are inspected as documents.
- `discovery`: explicit search queries, allowed only on catalog/discovery sources. At least one search is required per scope.
- `instructions`: short human-readable collection and interpretation notes; these never authorize tools, credentials or changes to business rules.

Mandatory sources have a `review` date and notes describing the curated layout and collection method. This is an editorial review, not the last successful execution or a permanent availability guarantee. Do not persist attempt counts, errors, delays, cache, sessions or retry state in this registry. Reports may state that a source was not verified without retaining its attempt history.

### Maintaining the registry

1. Find the existing stable ID before adding a URL; retain its history and attribution.
2. Set precise scopes, topics, role, origin category and units/boundary limitations. New individual citations start as references with `pagination: unreviewed` unless their traversal has actually been reviewed.
3. For a mandatory source, inspect content and pagination, define only necessary detail-page prefixes, choose meaningful expected text and document the review. Add its IDs to the relevant coverage slots. Do not infer a public capability from a price or an instance's regional availability from a provider-wide listing.
4. Validate the JSON Schema plus the repository's cross-reference, replacement-chain and coverage tests. Run `yarn build:site`, `yarn check:site` and `yarn test:site`; never fetch/rewrite datasets with `build:data` for a registry edit.
5. Update the affected package/website LLM references and guides for contract, attribution or methodology changes. Routine source corrections within this contract do not require a bot release.

The bootstrap preserves existing reference IDs, qualifies official catalog entry points, narrows provider scopes and records evidenced URL replacements. Imported individual references remain available for later evidence checks; this is not a claim that every legacy URL or every catalog detail page has already been validated by a production run.

## Cloud

| File                                                                                                                        | Purpose                                                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [cloud/host-inputs.json](https://github.com/digital4better/data/blob/main/sources/cloud/host-inputs.json)                   | Active host profiles, placement constraints and legacy impact values used by the [calculator](https://github.com/digital4better/data/blob/main/scripts/cloud-hosts.ts). |
| [cloud/host-evidence.json](https://github.com/digital4better/data/blob/main/sources/cloud/host-evidence.json)               | Source URLs, snapshot dates, hashes and hardware evidence behind the profiles.                                                                                          |
| [cloud/hardware-corrections.json](https://github.com/digital4better/data/blob/main/sources/cloud/hardware-corrections.json) | Reviewed hardware corrections and their official sources, retained as regression-test evidence.                                                                         |

Check host catalogs without fetching external data using `yarn ts-node scripts/cloud-hosts.ts --check`. Use `--write` after reviewing input changes. One-time migration tools and exploratory reports remain available in Git history, not in the active tree.

## Historical Electricity References

`ember-legacy-territories.json` preserves previously published Digital4Better mix and factor series for BM, GI, NU, SH and TL, which are absent from the current Ember generation exports.

The snapshot is extracted from the immutable Git tag `v1.3.68`, commit `9dc09cb` (the complete commit and release date are recorded in the JSON). It contains the five country series from the eight `factor/country-*` and `mix/country-*` JSON files, including yearly/monthly and full-mix/green variants. The original files remain available at https://github.com/digital4better/data/tree/v1.3.68/data and in npm package `@digital4better/data@1.3.68`.

These are previously computed outputs, **not archived raw Ember observations**. Some periods were already modeled or carried forward. Their upstream observation dates cannot be recovered from these files and remain unknown.

The generator uses these series only when the territory is entirely absent from the current Ember import. It preserves historical values, carries the last available value forward to the current export period, and writes [`scripts/electricity-provenance.json`](../scripts/electricity-provenance.json). This metadata is included in npm and copied to the website's existing `electricity-provenance.json` URL. When current Ember observations return for a territory, the current import takes precedence and historical fallback is disabled for it. Historical country series are restored after aggregation: absent raw generation/import volumes are not invented for global or continental weighting.

Do not update this snapshot by copying generated output back into it: doing so would erase its provenance and could compound previous fallbacks. A future replacement requires a verified source and an explicit provenance update.
