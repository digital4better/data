# Transport factors

Annual environmental impact factors for employee travel. Values are expressed per passenger-kilometre (`pkm`) for collective and active transport, or per vehicle-kilometre (`vkm`) for individual motor vehicles.

## Scope

The initial French catalogue comes from the ADEME Impact CO2 transport API. API calls omit `includeConstruction`, so construction impacts are excluded. Aviation values keep radiative forcing because the API default does not set `ignoreRadiativeForcing`.

`location` identifies the geographic context of the reference factor, not the origin or destination of a trip. A French factor may therefore be applied to a cross-border trip when the selected methodology is the ADEME French catalogue; itinerary locations remain usage data managed by the consuming application.

The four aviation records use the official distance bands and are normalized to one kilometre:

| Factor              | Impact CO2 distance | Impact CO2 label          |
| ------------------- | ------------------: | ------------------------- |
| `plane-short`       |              500 km | Avion trajet court        |
| `plane-medium`      |            1,500 km | Avion trajet moyen        |
| `plane-medium-long` |            3,000 km | Avion trajet moyen à long |
| `plane-long`        |            6,000 km | Avion trajet long         |

The other mappings are:

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

Average car values use the source's 2025 model. Other values use the 2026 published snapshot because the API does not expose a more specific annual validity period.

No European transport value is published in this first version. The Base Carbone entries with an explicit European location do not provide an unambiguous equivalent for the selected professional catalogue and system boundary. French values are never used as an implicit European fallback.
