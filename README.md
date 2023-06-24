# Digital4Better Environmental Data

Ce document présente la méthodologie appliquée pour déterminer les facteurs d’impact environnementaux de la production de 1kwh d'électricité. Ces données sont utilisées par le moteur fruggr pour évaluer les impacts environnementaux induits par l’utilisation d’un service web.

Zone de texte



Les facteurs sont déterminés pour cet ensemble d’indicateur d’impact environnementaux :

- climate change total
- freshwater and terrestrial acidification
- freshwater ecotoxicity
- freshwater eutrophication
- marine eutrophication
- terrestrial eutrophication
- carcinogenic effects
- ionising radiation
- non-carcinogenic effects
- ozone layer depletion
- photochemical ozone creation
- respiratory effects, inorganics
- dissipated water
- land use
- minerals and metals

Ils sont déterminés par pays en fonction du mix énergétique national ainsi que les impacts environnementaux associée à chacune de ces sources de production d’énergie, découpé en 9 technologies de production d’énergie :

- coal (1)
- gas (1)
- other fossil (2)
- wind (1)
- solar (1)
- bioenergy (2)
- hydro (1)
- other renewables (2)
- nuclear (1)

Nos données de mix énergétique pour tous les pays annuel (et mensuel pour 85 pays/régions) sont extraites de https://ember-climate.org/.

Mix énergétique mensuel par pays : https://ember-climate.org/data-catalogue/monthly-electricity-data/
Mix énergétique annuel par pays : https://ember-climate.org/data-catalogue/yearly-electricity-data/

Les données d’impacts de chaque technologie de production d’électricité par kWh proviennent de diverses sources bibliographiques. Ces données sont relatives à l’Europe, dû à la rareté de ces données dans un scope mondiale, une extrapolation est réalisée et ces valeurs sont généralisées dans notre modèle.

Source : Life cycle assessment of electricity generation options, UNECE 2021 (1) et https://www.sciencedirect.com/science/article/pii/S0196890422008159#b0530 (2)

Cas particulier de l’énergie renouvelable : Nous sommes en mesure de fournir un facteur d’impact énergie renouvelable en prenant en compte les technologies de productions d’énergie dites renouvelable (wind, solar, bioenergy, other renewable, hydro).

Méthodologie pour le calcul des facteurs d’impacts environnementaux:

1. Récupérer les extracts de Ember https://ember-climate.org/data-catalogue/yearly-electricity-data/
1. Filtrer sur l'année voulue et la pays voulu
1. Filtrer sur la category = Electricity generation + Electricity imports
1. Filtrer sur subcategory = Fuel + Total + Electricity imports
1. Récupérer les % des différentes technologies de production + Total generation + Net Imports
1. Faire la somme de Total generation + Net imports = c'est le total d'électricité utilisé dans le pays xx pour l'année xx
1. Pour chaque technologies de production, calculer le nombre de Twh d'électricité produits (avec le % de chaque techno) et le convertir en kWh
1. Récupérer les facteurs d'émission de chaque technologies de production, disponible dans le fichier ici
1. Multiplier les kWh calculés en étape 7 par les facteurs d'émission de l'étape 8 pour obtenir des kgCO2eq pour l'ensemble des kWh produits par chaque techno sur le temps d'intérêt dans le pays d'intérêt
1. Diviser la somme des kgCO2eq par le Total génération + Net imports en kWh pour obtenir des kgCO2eq/kwh correspondant au mix énergétique du pays considéré 
