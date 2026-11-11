# Transport Reference Data

Annual environmental impact factors for employee travel. Values are expressed per passenger-kilometre (`pkm`) for collective and active transport, or per vehicle-kilometre (`vkm`) for individual motor vehicles.

## Files

| File | Purpose |
| --- | --- |
| [factors.json](./factors.json) · [factors.csv](./factors.csv) | Annual travel impact factors by mode |

## File Structure and Units

JSON is an array of factor objects; CSV has one row per object. A record is identified by the combination of `id`, `location` and `period`. Use the aviation distance bands below to select a flight factor.

| Field | Type / unit | Meaning |
| --- | --- | --- |
| `id` | Text | Energy or travel-mode identifier. |
| `location` | Text code | Reference geography, such as `FR` or `EU`. |
| `period` | Year string (`YYYY`) | Reference period; check whether it is a source year or snapshot year. |
| `unit` | `pkm` or `vkm` | Passenger-kilometres or vehicle-kilometres. This is the denominator for every impact. |
| `source` | Text | Source name or description. |
| `sourceUrl` | URL | Source record, API request or underlying dataset. |
| Impact fields below | Numbers | Environmental impacts per functional unit. |

<details>
<summary>Environmental impact columns and units</summary>

| Field | Indicator | Numerator unit |
| --- | --- | --- |
| `adpe` | Resource use, minerals and metals | kg Sb eq |
| `ap` | Acidification | mol H+ eq |
| `ctue` | Freshwater ecotoxicity | CTUe |
| `ctuh-c` | Human toxicity, cancer | CTUh |
| `ctuh-nc` | Human toxicity, non-cancer | CTUh |
| `gwp` | Climate change | kg CO2 eq |
| `ir` | Ionising radiation | kBq U-235 eq |
| `pm` | Particulate matter | disease incidence |
| `wu` | Water use | m3 world eq |

Divide the numerator unit by the record's `unit`: for example, kg CO2 eq/pkm. Water-use equivalents are not physical litres of water. The JSON currently exposes GWP only. CSV retains the shared nine-indicator header; unsupported indicators are empty. Missing fields and empty cells mean unavailable, not zero.

</details>

## Using the Data

Choose the travel mode, location and period, then multiply the factor by distance in its functional unit:

- `pkm`: passenger-kilometres for collective and active transport.
- `vkm`: vehicle-kilometres for individual motor vehicles, regardless of passenger count.

For example, `gwp` is kgCO2e/pkm or kgCO2e/vkm. Missing indicators are unavailable, not zero.

`location` identifies the geographic context of the reference factor, not the origin or destination of a trip. A French factor may therefore be applied to a cross-border trip when the selected methodology is the ADEME French catalogue; itinerary locations remain usage data managed by the consuming application.

## Methodology

The French catalogue excludes vehicle construction and retains aviation radiative forcing. Source requests omit `includeConstruction` and do not set `ignoreRadiativeForcing`.

The four aviation records use the source distance bands and are normalized to one kilometre:

| Factor              | Impact CO2 distance | Impact CO2 label          |
| ------------------- | ------------------: | ------------------------- |
| `plane-short`       |              500 km | Avion trajet court        |
| `plane-medium`      |            1,500 km | Avion trajet moyen        |
| `plane-medium-long` |            3,000 km | Avion trajet moyen à long |
| `plane-long`        |            6,000 km | Avion trajet long         |

Average car factors use the source's 2025 model. Other factors use a 2026 source snapshot because a more specific annual validity period is unavailable.

## Sources and Attribution

Factors come from the [ADEME Impact CO2 transport API](https://impactco2.fr/outils/transport). The table below preserves source identifiers for verification.

<details>
<summary>Transport source records</summary>

| Factor               | Impact CO2 ID | Impact CO2 label                             |
| -------------------- | ------------: | -------------------------------------------- |
| `train-tgv`          |             2 | TGV                                          |
| `train-intercity`    |             3 | Intercités                                   |
| `train-ter`          |            15 | TER                                          |
| `train-rer`          |            14 | RER ou Transilien                            |
| `coach`              |             6 | Autocar thermique                            |
| `bus-thermal`        |             9 | Bus thermique                                |
| `bus-electric`       |            16 | Bus électrique                               |
| `tram`               |            10 | Tramway                                      |
| `metro`              |            11 | Métro                                        |
| `car-petrol`         |           125 | Voiture thermique (Moyenne - Essence)        |
| `car-diesel`         |           130 | Voiture thermique (Moyenne - Diesel)         |
| `car-electric`       |           135 | Voiture électrique (Moyenne)                 |
| `car-hybrid`         |           140 | Voiture hybride (Moyenne - Non rechargeable) |
| `car-plug-in-hybrid` |           145 | Voiture hybride (Moyenne - Rechargeable)     |
| `scooter-thermal`    |            12 | Scooter thermique                            |
| `scooter-electric`   |            33 | Scooter électrique                           |
| `motorcycle-small`   |            32 | Moto thermique (<= 250 cm³)                  |
| `motorcycle-large`   |            13 | Moto thermique (> 250 cm³)                   |
| `walking`            |            30 | Marche                                       |
| `bicycle`            |             7 | Vélo mécanique                               |
| `electric-bicycle`   |             8 | Vélo à assistance électrique                 |

</details>

## Limitations

No equivalent European catalogue is published for the same modes and system boundary. French factors are never used as an implicit European fallback. These are reference averages, not measurements of a particular vehicle or journey.
