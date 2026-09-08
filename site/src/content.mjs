export const repository = "https://github.com/digital4better/data";
export const license = "https://opendatacommons.org/licenses/odbl/1-0/";
export const collections = [
  {
    id: "factor",
    title: ["Facteurs d’impact électrique", "Electricity impact factors"],
    description: [
      "Traduire une consommation électrique en impacts environnementaux, par territoire et par période.",
      "Translate electricity consumption into environmental impacts by territory and period.",
    ],
    use: [
      "Estimer les impacts de 100 kWh consommés dans un pays et suivre leur évolution.",
      "Estimate the impacts of 100 kWh consumed in a country and track their evolution.",
    ],
    unit: [
      "Impacts par kWh consommé ; unités propres à chaque indicateur.",
      "Impacts per kWh consumed; each indicator has its own unit.",
    ],
    limits: [
      "Facteurs modélisés à partir du mix électrique et de références de cycle de vie. Les périodes présentes peuvent inclure des valeurs reconduites ou estimées.",
      "Factors modeled from electricity mixes and lifecycle references. Available periods may include carried-forward or estimated values.",
    ],
    sources: [
      ["Ember", "https://ember-climate.org/data-catalogue/"],
      [
        "UNECE · Analyse du cycle de vie / Lifecycle assessment",
        "https://unece.org/sed/documents/2021/10/reports/life-cycle-assessment-electricity-generation-options",
      ],
    ],
  },
  {
    id: "mix",
    title: ["Mix électrique", "Electricity mix"],
    description: [
      "Explorer la part des technologies de production électrique et leur évolution dans le temps.",
      "Explore the share of electricity generation technologies and how it changes over time.",
    ],
    use: [
      "Comprendre la composition du mix associé aux facteurs d’impact électrique.",
      "Understand the electricity mix behind environmental impact factors.",
    ],
    unit: [
      "Parts comprises entre 0 et 1 dans les fichiers ; pourcentages dans les graphiques.",
      "Shares between 0 and 1 in the files; percentages in charts.",
    ],
    limits: [
      "Le mix combine production et importations selon la méthode du générateur. Le scénario « green » sélectionne la bioénergie, l’hydraulique, le solaire et l’éolien et renormalise leurs parts ; ce n’est pas une mesure contractuelle d’électricité renouvelable.",
      "The mix combines generation and imports using the generator methodology. “Green” selects Bioenergy, Hydro, Solar and Wind and renormalizes their shares; it is not a contractual renewable-electricity measurement.",
    ],
    sources: [["Ember", "https://ember-climate.org/data-catalogue/"]],
  },
  {
    id: "cloud",
    title: ["Infrastructure cloud", "Cloud infrastructure"],
    description: [
      "Consulter les régions, machines virtuelles, processeurs et accélérateurs de six fournisseurs cloud.",
      "Browse regions, virtual machines, processors and accelerators across six cloud providers.",
    ],
    use: [
      "Identifier une région et les caractéristiques du matériel pour alimenter un modèle d’empreinte.",
      "Identify a region and hardware characteristics to inform a footprint model.",
    ],
    unit: [
      "PUE : ratio ; WUE : vérifier le périmètre de la source ; REF : fraction. Les unités matérielles dépendent des champs.",
      "PUE: ratio; WUE: check the source boundary; REF: fraction. Hardware units depend on the fields.",
    ],
    limits: [
      "Les périmètres et années des publications fournisseurs diffèrent. Un zéro peut représenter une convention du référentiel plutôt qu’une absence d’impact. REF et CFE ne sont pas des indicateurs interchangeables.",
      "Provider disclosures differ in boundary and reporting year. Zero may represent a dataset convention rather than no impact. REF and CFE are not interchangeable metrics.",
    ],
    sources: [
      [
        "Sources et hypothèses par fournisseur / Provider sources and assumptions",
        repository + "#cloud-infrastructure",
      ],
    ],
  },
  {
    id: "ai",
    title: ["Modèles d’intelligence artificielle", "AI models"],
    description: [
      "Découvrir les caractéristiques, modalités et capacités des modèles d’IA, avec leurs sources et estimations.",
      "Discover AI model characteristics, modalities and capabilities, with sources and estimates.",
    ],
    use: [
      "Constituer un inventaire de modèles et identifier ceux qui prennent en charge une modalité ou les outils.",
      "Build a model inventory and identify models supporting a modality or tools.",
    ],
    unit: [
      "Contexte en tokens ; paramètres en milliards. Identifiants et champs techniques conservés dans leur langue source.",
      "Context in tokens; parameters in billions. Identifiers and technical fields retain their source language.",
    ],
    limits: [
      "Le catalogue peut contenir des modèles anciens. Le champ open n’est pas une licence. Les champs estimated signalent des estimations ; aucune empreinte environnementale par modèle n’est fournie.",
      "The catalog may include legacy models. The open field is not a license. estimated flags estimated fields; no per-model environmental footprint is provided.",
    ],
    sources: [["Sources de chaque modèle / Per-model sources", repository + "/blob/main/data/ai/models.json"]],
  },
  {
    id: "equipment",
    title: ["Équipements numériques", "Digital equipment"],
    description: [
      "Réutiliser les références de consommation et d’impacts de fabrication des équipements numériques.",
      "Reuse operational energy and embodied impact references for digital equipment.",
    ],
    use: [
      "Associer une catégorie d’équipement à une consommation ou à un facteur de fabrication.",
      "Associate an equipment category with energy consumption or an embodied impact factor.",
    ],
    unit: [
      "Lire le champ unit de chaque entrée. Les facteurs de fabrication peuvent être ramenés à une seconde d’utilisation (/s).",
      "Read the unit field of each entry. Embodied factors may be allocated per second of use (/s).",
    ],
    limits: [
      "Valeurs de référence pour la modélisation, pas des mesures de chaque appareil. Ne pas interpréter un facteur /s comme l’impact total de fabrication d’un équipement.",
      "Modeling references, not measurements of individual devices. Do not interpret a /s factor as the total embodied impact of a device.",
    ],
    sources: [["Références et contribution / References and contribution", repository + "#equipment-reference-data"]],
  },
  {
    id: "energy",
    title: ["Technologies énergétiques", "Energy technologies"],
    description: [
      "Consulter neuf indicateurs environnementaux pour les technologies de production d’électricité.",
      "Browse nine environmental indicators for electricity generation technologies.",
    ],
    use: [
      "Comparer les facteurs de cycle de vie des technologies avec des unités cohérentes.",
      "Compare lifecycle factors across technologies with consistent units.",
    ],
    unit: ["Impacts par kWh ; unités spécifiques aux indicateurs.", "Impacts per kWh; indicator-specific units."],
    limits: [
      "Facteurs de cycle de vie issus de références bibliographiques. Ils ne décrivent pas les émissions instantanées d’une centrale.",
      "Lifecycle factors from literature references. They do not describe instantaneous power-plant emissions.",
    ],
    sources: [
      [
        "UNECE · Lifecycle assessment",
        "https://unece.org/sed/documents/2021/10/reports/life-cycle-assessment-electricity-generation-options",
      ],
    ],
  },
];
export const guides = [
  {
    id: "electricity",
    title: ["Utiliser un facteur d’impact électrique", "Using an electricity impact factor"],
    collection: "factor",
    sections: [
      [
        ["Choisir le bon périmètre", "Choose the right boundary"],
        [
          "Sélectionnez le territoire, la période et l’indicateur correspondant à votre consommation. Les fichiers annuels et mensuels ne doivent pas être mélangés. Une année en cours est partielle.",
          "Select the territory, period and indicator matching your consumption. Do not mix annual and monthly files. The current year is partial.",
        ],
      ],
      [
        ["Appliquer le facteur", "Apply the factor"],
        [
          "Impact = consommation en kWh × facteur par kWh. Exemple pédagogique : 100 kWh × 0,05 kg CO₂e/kWh = 5 kg CO₂e. Le facteur de cet exemple est fictif ; utilisez la valeur du fichier pour votre calcul.",
          "Impact = consumption in kWh × factor per kWh. Educational example: 100 kWh × 0.05 kg CO₂e/kWh = 5 kg CO₂e. This example factor is fictional; use the dataset value for your calculation.",
        ],
      ],
      [
        ["Interpréter les résultats", "Interpret the results"],
        [
          "Le carbone n’est qu’un indicateur parmi neuf. Consultez les unités, les sources et les hypothèses. Une période disponible ne garantit pas des observations nouvelles : le générateur peut compléter les données manquantes. La variante green est un scénario renormalisé, pas la preuve d’un contrat d’énergie verte.",
          "Carbon is only one of nine indicators. Review units, sources and assumptions. An available period does not guarantee new observations: the generator may fill gaps. The green variant is a renormalized scenario, not evidence of a green-energy contract.",
        ],
      ],
    ],
  },
  {
    id: "cloud-metrics",
    title: ["Comprendre PUE, WUE et REF", "Understanding PUE, WUE and REF"],
    collection: "cloud",
    sections: [
      [
        ["Trois mesures distinctes", "Three distinct measures"],
        [
          "PUE rapporte l’énergie totale du datacenter à celle de ses équipements informatiques. WUE décrit l’usage de l’eau rapporté à une énergie, avec un périmètre à vérifier dans la source. REF exprime ici une fraction liée à l’énergie renouvelable ; Google utilise des données CFE régionales dans ce référentiel.",
          "PUE relates total datacenter energy to IT equipment energy. WUE describes water use relative to energy, with a boundary to check in the source. REF here expresses a renewable-energy-related fraction; Google uses regional CFE data in this dataset.",
        ],
      ],
      [
        ["Comparer avec prudence", "Compare carefully"],
        [
          "Vérifiez l’année, le site, le périmètre et la méthode avant de comparer deux régions. Une valeur fournisseur globale peut servir de remplacement régional. Un PUE plus faible ne suffit pas à établir une empreinte totale plus faible.",
          "Check year, site, boundary and methodology before comparing regions. A provider-wide value may substitute for a regional value. Lower PUE alone does not establish a lower total footprint.",
        ],
      ],
      [
        ["Conventions du référentiel", "Dataset conventions"],
        [
          "AWS conserve REF à zéro par convention. Oracle utilise notamment un WUE provisoire à zéro. Ces valeurs ne signifient ni absence d’énergie renouvelable ni absence de consommation d’eau. Les hypothèses complètes restent liées depuis la collection.",
          "AWS keeps REF at zero by convention. Oracle notably uses a provisional zero WUE. These do not mean no renewable energy or no water use. Full assumptions are linked from the collection.",
        ],
      ],
    ],
  },
  {
    id: "ai-models",
    title: ["Lire les caractéristiques des modèles d’IA", "Reading AI model characteristics"],
    collection: "ai",
    sections: [
      [
        ["Caractéristiques et capacités", "Characteristics and capabilities"],
        [
          "Le contexte indique une capacité en tokens, pas la longueur garantie d’une réponse. input et output décrivent les modalités ; reasoning et tools signalent des capacités répertoriées. Les identifiants providers permettent de retrouver les variantes chez les hébergeurs.",
          "Context indicates capacity in tokens, not guaranteed response length. input and output describe modalities; reasoning and tools record capabilities. providers identifiers help locate hosted variants.",
        ],
      ],
      [
        ["Données estimées et ouverture", "Estimates and openness"],
        [
          "Consultez estimated avant d’utiliser parameters ou context. Pour une architecture MoE, distinguez paramètres actifs et totaux. Le booléen open ne remplace pas la lecture de la licence du modèle.",
          "Check estimated before using parameters or context. For MoE architectures, distinguish active and total parameters. The open boolean does not replace reading the model license.",
        ],
      ],
      [
        ["Limites de réutilisation", "Reuse limits"],
        [
          "Les modèles anciens peuvent rester dans le catalogue. Vérifiez la disponibilité auprès du fournisseur. Le nombre de paramètres ne suffit pas à calculer une empreinte environnementale et le catalogue ne fournit pas cette empreinte.",
          "Legacy models may remain in the catalog. Check availability with the provider. Parameter count alone cannot determine environmental footprint, which this catalog does not provide.",
        ],
      ],
    ],
  },
];
export const impacts = {
  gwp: ["Changement climatique · kg CO₂e", "Climate change · kg CO₂e"],
  adpe: ["Épuisement des ressources · kg Sbe", "Resource depletion · kg Sbe"],
  ap: ["Acidification · kg SO₂e", "Acidification · kg SO₂e"],
  ctue: ["Écotoxicité de l’eau douce · CTUe", "Freshwater ecotoxicity · CTUe"],
  "ctuh-c": ["Toxicité humaine, cancer · CTUh", "Human toxicity, cancer · CTUh"],
  "ctuh-nc": ["Toxicité humaine, hors cancer · CTUh", "Human toxicity, non-cancer · CTUh"],
  ir: ["Rayonnements ionisants · kg U235e", "Ionising radiation · kg U235e"],
  pm: ["Particules fines · kg PM2.5e", "Particulate matter · kg PM2.5e"],
  wu: ["Usage de l’eau · m³", "Water use · m³"],
};
export const fieldLabels = {
  name: ["Nom source", "Source name"],
  id: ["Identifiant stable", "Stable identifier"],
  vendor: ["Éditeur du modèle", "Model vendor"],
  open: ["Indicateur d’ouverture ; vérifier la licence", "Openness indicator; check the license"],
  type: ["Type de modèle ou de matériel", "Model or hardware type"],
  architecture: ["Architecture", "Architecture"],
  context: ["Fenêtre de contexte (tokens)", "Context window (tokens)"],
  parameters: ["Paramètres actifs / totaux (milliards)", "Active / total parameters (billions)"],
  "parameters.active": ["Paramètres actifs (milliards)", "Active parameters (billions)"],
  "parameters.total": ["Paramètres totaux (milliards)", "Total parameters (billions)"],
  input: ["Modalités d’entrée", "Input modalities"],
  output: ["Modalités de sortie", "Output modalities"],
  reasoning: ["Capacité de raisonnement répertoriée", "Recorded reasoning capability"],
  tools: ["Prise en charge des outils", "Tool support"],
  sources: ["URL des sources", "Source URLs"],
  estimated: ["Champs estimés", "Estimated fields"],
  providers: ["Identifiants par hébergeur", "Hosted identifiers by provider"],
  pattern: ["Expression de reconnaissance du nom", "Name-matching expression"],
  unit: ["Unité applicable à cette entrée", "Unit applying to this entry"],
  value: ["Valeur dans l’unité indiquée", "Value in the stated unit"],
  description: ["Description source", "Source description"],
  pue: ["Énergie totale / énergie informatique", "Total energy / IT energy"],
  wue: ["Usage de l’eau / énergie ; voir source", "Water use / energy; see source"],
  ref: ["Fraction ; convention fournisseur à vérifier", "Fraction; check provider convention"],
  lat: ["Latitude (degrés)", "Latitude (degrees)"],
  lon: ["Longitude (degrés)", "Longitude (degrees)"],
  country: ["Code pays source", "Source country code"],
  location: ["Localisation source", "Source location"],
  provider: ["Fournisseur cloud", "Cloud provider"],
  memory: ["Mémoire (GB)", "Memory (GB)"],
  vcpus: ["Nombre de processeurs virtuels", "Virtual CPU count"],
  cores: ["Nombre de cœurs", "Core count"],
  threads: ["Nombre de threads", "Thread count"],
  tdp: ["Enveloppe thermique (W)", "Thermal design power (W)"],
  virtual: ["Machine virtuelle", "Virtual machine"],
  cpu: ["Identifiants des processeurs", "Processor identifiers"],
  manufacturer: ["Fabricant", "Manufacturer"],
  family: ["Famille", "Family"],
  model: ["Modèle", "Model"],
  category: ["Catégorie", "Category"],
  embodied: ["Impact de fabrication (tCO₂e)", "Embodied impact (tCO₂e)"],
};
export const tr = (pair, lang) => pair[lang === "fr" ? 0 : 1];
export function datasetTitle(file, lang) {
  const stem = file.replace(/\.json$/, "");
  const tokens = {
    world: ["Monde", "World"],
    continent: ["Continents", "Continents"],
    country: ["Pays", "Countries"],
    subdivision: ["Subdivisions", "Subdivisions"],
    yearly: ["Annuel", "Annual"],
    monthly: ["Mensuel", "Monthly"],
    green: ["Scénario renouvelable (green)", "Renewable scenario (green)"],
    regions: ["Régions", "Regions"],
    vms: ["Machines virtuelles", "Virtual machines"],
    cpus: ["Processeurs", "Processors"],
    accelerators: ["Accélérateurs", "Accelerators"],
    models: ["Catalogue des modèles", "Model catalog"],
    embodied: ["Fabrication", "Embodied impacts"],
    energy: ["Consommation", "Energy use"],
    impacts: ["Impacts", "Impacts"],
  };
  return stem
    .split("-")
    .map((p) => (tokens[p] ? tr(tokens[p], lang) : p.toUpperCase()))
    .join(" · ");
}
Object.assign(fieldLabels, {
  aliases: ["Autres identifiants connus", "Other known identifiers"],
  accelerator: ["Identifiant de l’accélérateur", "Accelerator identifier"],
  accelerators: ["Nombre d’accélérateurs", "Accelerator count"],
  corpus: ["Taille du corpus ; unité à vérifier dans la source", "Corpus size; check source unit"],
  dimension: ["Dimension de la représentation", "Representation dimension"],
  hidden_dimension: ["Dimension cachée du modèle", "Model hidden dimension"],
  die: ["Surface de puce (mm²)", "Die area (mm²)"],
  transistors: ["Nombre de transistors (millions)", "Transistor count (millions)"],
  process: ["Finesse de gravure (nm)", "Process node (nm)"],
  serie: ["Série matérielle", "Hardware series"],
  platform: ["Plateforme matérielle", "Hardware platform"],
  smp: ["Nombre de sockets pris en charge", "Supported socket count"],
  ssd: ["Stockage SSD ; voir la spécification fournisseur", "SSD storage; see provider specification"],
  hdd: ["Stockage HDD ; voir la spécification fournisseur", "HDD storage; see provider specification"],
  ocpus: ["Nombre d’OCPU Oracle", "Oracle OCPU count"],
  shape: ["Forme d’instance fournisseur", "Provider instance shape"],
  flex: ["Configuration flexible", "Flexible configuration"],
  subdivision: ["Code de subdivision", "Subdivision code"],
  adpf: [
    "Épuisement des ressources fossiles ; unité source à vérifier",
    "Fossil resource depletion; verify source unit",
  ],
  epf: ["Eutrophisation des eaux douces ; unité source à vérifier", "Freshwater eutrophication; verify source unit"],
  epm: ["Eutrophisation marine ; unité source à vérifier", "Marine eutrophication; verify source unit"],
  ept: ["Eutrophisation terrestre ; unité source à vérifier", "Terrestrial eutrophication; verify source unit"],
  gwpb: ["Changement climatique biogénique ; unité source à vérifier", "Biogenic climate change; verify source unit"],
  gwpt: ["Changement climatique total ; unité source à vérifier", "Total climate change; verify source unit"],
  gwplu: [
    "Changement climatique lié à l’usage des sols ; unité source à vérifier",
    "Land-use climate change; verify source unit",
  ],
  lu: ["Usage des sols ; unité source à vérifier", "Land use; verify source unit"],
  odp: ["Appauvrissement de l’ozone ; unité source à vérifier", "Ozone depletion; verify source unit"],
  pocp: [
    "Formation d’ozone photochimique ; unité source à vérifier",
    "Photochemical ozone formation; verify source unit",
  ],
  mips: ["Intensité matérielle ; unité source à vérifier", "Material intensity; verify source unit"],
});
