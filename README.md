# Digital4Better Environmental Data

This repository contains the geographic and environmental data used by Digital4Better to calculate the footprints of digital services.

This data is also used by the calculation engine of fruggr (www.fruggr.io), a service that automates the evaluation of the footprints of digital services.

Each file is produced/generated in CSV and JSON format.

## Country data (country)

### Administrative data (countries.csv)

This data is used to map data and to distribute impact factors (see Impact factors) by continent.

| Field     | Description                     |
|-----------|---------------------------------|
| name      | Country name                    |
| alpha-2   | ISO 3166-1 alpha-2 country code |
| alpha-3   | ISO 3166-1 alpha-3 country code |
| continent | Country continent               |

### Distances from country to country (country-to-country-distances)

This data can be used to determine the distance traveled by data on the network between a user and a datacenter located in different countries.

The distance is calculated between the baricenters in each country.

| Field       | Description         |
|-------------|---------------------|
| origin      | Origin country      |
| destination | Destination country |
| distance    | Distance (km)       |

### Average distance from a user to a datacenter (user-to datacenter-distances.csv)

These data represent a rough estimate for each country of the average distance traveled by data on a network between a user and a datacenter.

| Field    | Description                     |
|----------|---------------------------------|
| alpha-2  | ISO 3166-1 alpha-2 country code |
| distance | Distance (km)                   |

## Impacts liés à la production d'énergie (energy)

The environmental impacts associated with each of these energy production sources, broken down into 9 energy production technologies: coal, gas, other fossil, wind, solar, bioenergy, hydro, other renewables, nuclear.

### Environmental impact (energy-impacts)

| Impact  | Unit       | Description                                                     |
|---------|------------|-----------------------------------------------------------------|
| ADPe    | kg Sb-Eq   | Abiotic Depletion Potential (Resource use, minerals and metals) |
| AP      | kg SO2-Eq  | Acidification Power                                             |
| CTUe    | CTUe       | Comparative Toxic Unit (Ecotoxicity, freshwater)                |
| CTUh-c  | CTUh       | Comparative Toxic Unit (Human, cancer)                          |
| CTUh-nc | CTUh       | Comparative Toxic Unit (Human, non-cancer)                      |
| GWP     | kg CO2-Eq  | Global Warming Potential (Climate change)                       |
| IR      | kg U235-Eq | Ionising Radiation (human health)                               |
| PM      | Disease    | Particulate Matter emission                                     |
| WU      | m3 Water   | Water use                                                       |

### Source 

The impact data for each electricity generation technology per kWh come from various bibliographical sources. Due to the scarcity of such data in a global scope, an extrapolation is made and these values are generalized in our model.

Source : Life cycle assessment of electricity generation options, UNECE 2021 (1) et https://www.sciencedirect.com/science/article/pii/S0196890422008159#b0530 (2)

## Impact factors (factor)

These data represent the environmental impact factors of one kWh of electricity consumption (not production) in each country, continent or worldwide.
The amount of energy imported by each country is taken into account to adjust these factors.

### Data generation

Impact factors are determined by country according to the national energy mix, as well as the environmental impacts associated with each of energy production sources (see Environmental impacts).

Factors are generated on an annual and monthly basis starting in January 2019.

Files ending with the suffix `-green` contain impact factors for green energies only (bioenergy, hydro, solar and wind).

### Source

Our energy mix data for all countries are taken from https://ember-climate.org/.

- Monthly : https://ember-climate.org/data-catalogue/monthly-electricity-data/
- Yearly : https://ember-climate.org/data-catalogue/yearly-electricity-data/

