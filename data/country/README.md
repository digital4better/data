# Geographic References

Geographic identifiers, map geometry and approximate distances for joining and visualizing the reference datasets. A territory's presence here does not establish electricity-data coverage.

## Files

| Dataset | Downloads | Purpose |
| --- | --- | --- |
| `continents` | [JSON](./continents.json) / [CSV](./continents.csv) | Continent codes and names |
| `countries` | [JSON](./countries.json) / [CSV](./countries.csv) | Country codes, names and continent membership |
| `regions` | [JSON](./regions.json) / [CSV](./regions.csv) | Geographic records with type-specific identifiers, area and coordinates |
| `regions-paths` | [JSON](./regions-paths.json) | SVG path strings keyed by territory identifier; no CSV |
| `country-to-country-distances` | [JSON](./country-to-country-distances.json) / [CSV](./country-to-country-distances.csv) | Pairwise country distances |
| `region-to-region-distances` | [JSON](./region-to-region-distances.json) / [CSV](./region-to-region-distances.csv) | Pairwise country/subdivision distances |
| `user-to-datacenter-distances` | [JSON](./user-to-datacenter-distances.json) / [CSV](./user-to-datacenter-distances.csv) | Area-based distance proxy within each territory |

## File Structure and Units

`continents`, `countries` and `regions` are JSON arrays. Geometry and distance files are objects keyed by identifiers; pairwise distance keys concatenate origin and destination without a separator. Their CSV versions separate the identifiers into columns.

| Field | Meaning / unit |
| --- | --- |
| `code` | Continent identifier |
| `name` | Display name; preserve the source spelling |
| `alpha-2`, `alpha-3` | Country identifiers where present |
| `continent` | Continent **code** in `regions`, but continent **name** in `countries` |
| `subdivision` | Subdivision suffix; combine with country alpha-2 using a hyphen |
| `type` | Geographic record type; inspect before interpreting optional fields |
| `area` | Reference area in km2 |
| `lat`, `lon` | Reference latitude and longitude, decimal degrees |
| `origin`, `destination` | Source identifiers for a distance pair (CSV) |
| `distance` | Approximate distance in km |

In `user-to-datacenter-distances.csv`, the historical column name `alpha-2` can also hold a complete subdivision identifier, not only a two-letter country code.

## Using the Data

Resolve identifiers against actual records rather than splitting every key into two-character segments. Prefer pairwise CSV files when separate origin/destination columns are needed. Electricity continent keys use names; cloud country identifiers may be lowercase. Map geometry is a visualization asset, not a factor or coverage list.

## Methodology

Pairwise distances use the spherical distance between reference coordinates, with Earth radius 6,371 km, rounded to three decimals. They are not road or network distances. User-to-datacenter distance uses `sqrt(area / pi)`, rounded to three decimals: the radius of a circle with the territory's area, not a measured path to a known datacenter.

## Sources and Attribution

Digital4Better maintains the geographic reference and derived distances using [ISO country/subdivision conventions](https://www.iso.org/iso-3166-country-codes.html). Record-level geographic and geometry source URLs are not supplied. Preserve identifiers and attribution under the [ODbL license](https://opendatacommons.org/licenses/odbl/1-0/).

## Limitations

Coordinates are representative locations, not site addresses. Distance proxies cannot establish internet routing, latency or actual user-to-server distance. Optional properties vary by geographic type. Historical names and identifiers remain as published; do not assume current administrative completeness.
