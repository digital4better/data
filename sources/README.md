# Source Evidence

These files support reproducibility and validation. They are maintenance inputs, not additional public datasets, and are excluded from the npm package and website downloads.

## Cloud

| File | Purpose |
| --- | --- |
| [cloud/host-inputs.json](./cloud/host-inputs.json) | Active host profiles, placement constraints and legacy impact values used by the [calculator](../scripts/cloud-hosts.cjs). |
| [cloud/host-evidence.json](./cloud/host-evidence.json) | Source URLs, snapshot dates, hashes and hardware evidence behind the profiles. |
| [cloud/hardware-corrections.json](./cloud/hardware-corrections.json) | Reviewed hardware corrections and their official sources, retained as regression-test evidence. |

Check host catalogs without fetching external data using `node scripts/cloud-hosts.cjs --check`. Use `--write` after reviewing input changes. One-time migration tools and exploratory reports remain available in Git history, not in the active tree.

## Historical Electricity References

`ember-legacy-territories.json` preserves previously published Digital4Better mix and factor series for BM, GI, NU, SH and TL, which are absent from the current Ember generation exports.

The snapshot is extracted from the immutable Git tag `v1.3.68`, commit `9dc09cb` (the complete commit and release date are recorded in the JSON). It contains the five country series from the eight `factor/country-*` and `mix/country-*` JSON files, including yearly/monthly and full-mix/green variants. The original files remain available at https://github.com/digital4better/data/tree/v1.3.68/data and in npm package `@digital4better/data@1.3.68`.

These are previously computed outputs, **not archived raw Ember observations**. Some periods were already modeled or carried forward. Their upstream observation dates cannot be recovered from these files and remain unknown.

The generator uses these series only when the territory is entirely absent from the current Ember import. It preserves historical values, carries the last available value forward to the current export period, and publishes `data/electricity-provenance.json`. When current Ember observations return for a territory, the current import takes precedence and historical fallback is disabled for it. Historical country series are restored after aggregation: absent raw generation/import volumes are not invented for global or continental weighting.

Do not update this snapshot by copying generated output back into it: doing so would erase its provenance and could compound previous fallbacks. A future replacement requires a verified source and an explicit provenance update.
