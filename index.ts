import { get } from "https";
import { createInterface } from "readline";
import { appendFileSync, writeFileSync } from "fs";
import * as AdmZip from "adm-zip";
import * as REGIONS from "./data/country/regions.json";
import * as IMPACTS from "./data/energy/energy-impacts.json";
import { PassThrough } from "stream";
import ReadableStream = NodeJS.ReadableStream;

const MIN_YEAR = 2019;
const CURRENT_MONTH = new Date().getUTCMonth();
const CURRENT_YEAR = new Date().getUTCFullYear();
const ENERGIES = [
  "Bioenergy",
  "Coal",
  "Gas",
  "Hydro",
  "Nuclear",
  "Other Fossil",
  "Other Renewables",
  "Solar",
  "Wind",
] as const;
const GREEN_ENERGIES = ["Bioenergy", "Hydro", "Solar", "Wind"] as const;
type Energy = (typeof ENERGIES)[number];
type GreenEnergy = (typeof GREEN_ENERGIES)[number];
const FOSSIL_FUELS: Energy[] = ["Bioenergy", "Coal", "Gas", "Other Fossil", "Other Renewables"];

const EMBER_DOMAIN = "https://ember-climate.org";
const EMBER_MONTHLY_DATA = `${EMBER_DOMAIN}/data-catalogue/monthly-electricity-data/`;
const EMBER_YEARLY_DATA = `${EMBER_DOMAIN}/data-catalogue/yearly-electricity-data/`;
const EMBER_WORLD = "World";
const EMBER_REGIONS = [
  "Africa",
  "Asia",
  "Europe",
  "Latin America and Caribbean",
  "Middle East",
  "North America",
  "Oceania",
];
const COUNTRY_EMBER_REGIONS: Record<string, (typeof EMBER_REGIONS)[number]> = {};

const isWorld = (region: string) => region === EMBER_WORLD;
const isContinent = (region: string) => EMBER_REGIONS.indexOf(region) >= 0;
const isCountry = (region: string) => !isWorld(region) && !isContinent(region) && !isSubdivision(region);
const isSubdivision = (region: string) => /^[a-z]{2}-[a-z]{2}$/i.test(region);
const isRegion = (region: string) => isCountry(region) || isSubdivision(region);

const REGION_FILTERS = {
  world: isWorld,
  continent: isContinent,
  country: isCountry,
  subdivision: isSubdivision,
};

const fetchAndScrap = async (url: string, regex: RegExp) =>
  new Promise((resolve) =>
    get(url, (response) => {
      let body = "";
      response.on("data", (response) => (body += response.toString()));
      response.on("end", () => resolve(regex.exec(body)?.[0]));
    })
  );

const processData = async (
  input: ReadableStream,
  process: (values: Record<string, string | number | Date>) => void
) => {
  const rl = createInterface({
    input,
    crlfDelay: Infinity,
  });
  const headers: string[] = [];
  for await (const line of rl) {
    const values = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
    if (headers.length === 0) {
      headers.push(
        ...values.map((header) => header.trim().toLowerCase().replace(/^"|"$/g, "").trim().replace(/\s+/g, "_"))
      );
    } else {
      process(
        headers.reduce<Record<string, string | number | Date>>((acc, header, index) => {
          const value = values[index]?.trim().replace(/^"|"$/g, "").trim();
          if (value === "") acc[header] = null;
          else if (/^\d{4}-\d{2}-\d{2}$/i.test(value)) acc[header] = new Date(value);
          else if (/^-?\d+(?:\.\d+)?$/i.test(value)) acc[header] = parseFloat(value);
          else acc[header] = value;
          return acc;
        }, {})
      );
    }
  }
};

const fetchAndProcess = async (url: string, onProcess: (values: Record<string, string | number | Date>) => void) =>
  new Promise((resolve) => {
    get(url, async (response) => {
      await processData(response, onProcess);
      resolve(true);
    });
  });

type Mix<T extends string> = { [energy in T]: number };

type Impacts = {
  adpe: number; // Abiotic Depletion Potential (Resource use, minerals and metals)
  ap: number; // Acidification Power
  ctue: number; // Comparative Toxic Unit (Ecotoxicity, freshwater)
  "ctuh-c": number; // Comparative Toxic Unit (Human, cancer)
  gwp: number; // Global Warming Potential (Climate change)
  ir: number; // Ionising radiation (human health)
  "ctuh-nc": number; // Comparative Toxic Unit (Human, non-cancer)
  pm: number; // Particulate matter emission
  wu: number; // Water use
};

const EMPTY_IMPACTS: Impacts = { adpe: 0, ap: 0, ctue: 0, "ctuh-c": 0, "ctuh-nc": 0, gwp: 0, ir: 0, pm: 0, wu: 0 };
const EMPTY_MIX: Mix<Energy> = {
  Bioenergy: 0,
  Coal: 0,
  Gas: 0,
  Hydro: 0,
  Nuclear: 0,
  "Other Fossil": 0,
  "Other Renewables": 0,
  Solar: 0,
  Wind: 0,
};
const EMPTY_GREEN_MIX: Mix<GreenEnergy> = {
  Bioenergy: 0,
  Hydro: 0,
  Solar: 0,
  Wind: 0,
};

const combine = <T extends { [k: string]: number }>({
  source,
  sourceCoeff,
  target,
  targetCoeff = 1,
}: {
  source?: T;
  target?: T;
  sourceCoeff?: number;
  targetCoeff?: number;
}): T =>
  Object.keys(source).reduce(
    (target: any, k) => {
      target[k] = target[k] * targetCoeff + source[k] * sourceCoeff;
      return target;
    },
    { ...target }
  );

type Aggregate = {
  mix: Mix<Energy>;
  importedTWh: number;
  generatedTWh: number;
  accuracy?: "world" | "continent" | "country" | "subdivision";
  freshness?: number;
  source?: "eia" | "ember" | "statcan";
};

type Aggregates = {
  [region: string]: {
    [period: string]: Aggregate;
  };
};

const cloneAggregate = (aggregate: Aggregate): Aggregate => ({
  ...aggregate,
});

const groupBy = (values: any[], fields: string[]) => {
  fields = [...fields];
  const field = fields.shift();
  if (!field) return values;
  const result: any[] = values.reduce((obj, value) => {
    const current = { ...value };
    if (fields.length) {
      if (!obj[current[field]]) obj[current[field]] = [];
      obj[current[field]].push(current);
    } else {
      obj[current[field]] = current;
    }
    delete current[field];
    return obj;
  }, {});
  if (fields.length) {
    for (const key in result) {
      result[key] = groupBy(result[key], fields.slice());
    }
  }
  return result;
};

const exportToCsv = (file: string, values: Record<string, string | number>[], headers?: string[]) => {
  headers = headers ?? Object.keys(values[0]);
  writeFileSync(file, headers.join(",") + "\r\n");
  for (const line of values)
    appendFileSync(
      file,
      headers.map((header) => (/,/.test(String(line[header])) ? `"${line[header]}"` : line[header])).join(",") + "\r\n"
    );
};

const degToRad = (deg: number) => deg * (Math.PI / 180.0);
const computeDistance = (
  origin: { lat: number; lon: number },
  destination: { lat: number; lon: number },
  precision = 3
) => {
  return (
    Math.round(
      Math.acos(
        Math.cos(degToRad(90 - origin.lat)) * Math.cos(degToRad(90 - destination.lat)) +
          Math.sin(degToRad(90 - origin.lat)) *
            Math.sin(degToRad(90 - destination.lat)) *
            Math.cos(degToRad(origin.lon - destination.lon))
      ) *
        6371 *
        Math.pow(10, precision)
    ) / Math.pow(10, precision)
  );
};

const roundNumber = (value: number, significationDigits = 6): number => {
  const exp = Math.floor(Math.log10(Math.abs(value)));
  const coeff = value / Math.pow(10, exp);
  return parseFloat(coeff.toFixed(significationDigits - 1) + "e" + exp);
};
const roundRatio = (value: number, maxDigits = 4): number => {
  return parseFloat(value.toFixed(maxDigits));
};

const sanitizeData = async (aggregates: Aggregates) => {
  process.stdout.write(`Removing empty data...`);
  let deletions = 0;
  for (const region of Object.keys(aggregates)) {
    for (const period of Object.keys(aggregates[region])) {
      const { generatedTWh, importedTWh } = aggregates[region][period];
      if (generatedTWh + importedTWh === 0) {
        deletions++;
        delete aggregates[region][period];
      }
    }
  }
  process.stdout.write(`${deletions} deletions\n`);
  process.stdout.write(`Filling missing data\n`);
  const passes: { yearly: boolean; scope: keyof typeof REGION_FILTERS }[] = [
    { yearly: true, scope: "world" },
    { yearly: true, scope: "continent" },
    { yearly: true, scope: "country" },
    { yearly: true, scope: "subdivision" },
    { yearly: false, scope: "world" },
    { yearly: false, scope: "continent" },
    { yearly: false, scope: "country" },
    { yearly: false, scope: "subdivision" },
  ];
  for (const { yearly, scope } of passes) {
    let additions = 0;
    process.stdout.write(`- ${yearly ? "yearly" : "monthly"} ${scope} data... `);
    for (const region of Object.keys(aggregates).filter((region) => REGION_FILTERS[scope](region))) {
      let last: Aggregate;
      const fill = (period: string, year: string): Aggregate => {
        if (!aggregates[region][period]) {
          if (last) aggregates[region][period] = cloneAggregate(last);
          else if (!yearly) {
            aggregates[region][period] = cloneAggregate(aggregates[region][year]);
          } else if (scope === "continent") {
            aggregates[region][period] = cloneAggregate(aggregates[EMBER_WORLD][period]);
            aggregates[region][period].generatedTWh = 1e-12; // 1Wh
            aggregates[region][period].importedTWh = 0;
          } else if (scope === "country") {
            aggregates[region][period] = cloneAggregate(aggregates[COUNTRY_EMBER_REGIONS[region]][period]);
            aggregates[region][period].generatedTWh = 1e-12; // 1Wh
            aggregates[region][period].importedTWh = 0;
          } else if (scope === "subdivision") {
            aggregates[region][period] = cloneAggregate(aggregates[region.slice(0, 2)][period]);
            aggregates[region][period].generatedTWh = 1e-12; // 1Wh
            aggregates[region][period].importedTWh = 0;
          } else throw new Error(`Cannot fill missing ${scope} data for region ${region} and period ${period}`);
          additions++;
        }
        return aggregates[region][period];
      };
      for (let year = MIN_YEAR; year <= CURRENT_YEAR; year++) {
        if (yearly) {
          last = fill(`${year}`, `${year}`);
        } else {
          for (let month = 0; month <= 11; month++) {
            last = fill(new Date(Date.UTC(year, month, 1)).toISOString().substring(0, 7), `${year}`);
          }
        }
      }
    }
    process.stdout.write(`${additions} additions\n`);
  }
};

const fetchWorldFactors = async (aggregates: Aggregates) => {
  process.stdout.write(`Fetching energy data\n`);
  for (const page of [EMBER_YEARLY_DATA, EMBER_MONTHLY_DATA]) {
    const url = EMBER_DOMAIN + (await fetchAndScrap(page, /\/app\/uploads\/[^/]+\/[^/]+\/[^.]+.csv/));
    let lines = 0;
    process.stdout.write(`- from ${url}... `);
    await fetchAndProcess(url, (data) => {
      const { country_code, ember_region, area, area_type, year, date, category, subcategory, variable, unit, value } =
        data as {
          country_code: string;
          area: string;
          ember_region: (typeof COUNTRY_EMBER_REGIONS)[string];
          area_type: string;
          year: number;
          date: Date;
          category: string;
          subcategory: string;
          variable: keyof typeof IMPACTS;
          unit: string;
          value: number;
        };
      const yearly = !!year;
      const period = yearly ? `${year}` : date.toISOString().substring(0, 7);
      const country = area_type === "Country";
      const region = country ? REGIONS.find(({ "alpha-3": alpha3 }) => alpha3 === country_code)?.["alpha-2"] : area;
      // Unknown area, stopping process
      if (!region) throw new Error(`Unknown area: ${country_code ?? area}`);
      // Dropping early years
      if (year && year < MIN_YEAR) return;
      if (date && date.getUTCFullYear() < MIN_YEAR) return;
      // Dropping unknown regions
      if (!country && isCountry(region)) return;
      // Filling country continent association
      if (country) COUNTRY_EMBER_REGIONS[region] = ember_region;
      // Initializing default values
      if (!aggregates[region]) aggregates[region] = {};
      if (!aggregates[region][period])
        aggregates[region][period] = {
          mix: { ...EMPTY_MIX },
          importedTWh: 0,
          generatedTWh: 0,
        };
      if (category === "Electricity generation") {
        if (subcategory === "Fuel" && unit === "%") {
          aggregates[region][period].mix[variable as keyof Mix<Energy>] = value / 100;
        }
        if (subcategory === "Total" && unit === "TWh") {
          aggregates[region][period].generatedTWh = value;
        }
      } else if (category === "Electricity imports" && unit === "TWh") {
        aggregates[region][period].importedTWh = value;
      }
      lines++;
    });
    process.stdout.write(`${lines} lines processed\n`);
  }
};

const finalizeSubdivisionMix = (aggregates: Aggregates, country: string) => {
  for (const [region, periods] of Object.entries(aggregates).filter(([region]) => region.startsWith(`${country}-`))) {
    for (const [period, { generatedTWh }] of Object.entries(periods)) {
      if (generatedTWh > 0) {
        Object.keys(aggregates[region][period].mix).forEach(
          (energy: Energy) => (aggregates[region][period].mix[energy] /= generatedTWh)
        );
        // Approximating imported TWh using a ratio to total energy generated
        aggregates[region][period].importedTWh = aggregates[country]?.[period]
          ? aggregates[country][period].importedTWh * (generatedTWh / aggregates[country][period].generatedTWh)
          : 0;
      }
    }
  }
};

const Mix = async (aggregates: Aggregates) => {
  const data = await (await fetch("https://www150.statcan.gc.ca/n1/tbl/csv/25100015-eng.zip")).arrayBuffer();
  const zip = new AdmZip(Buffer.from(data));
  const content = zip.getEntries().find(({ name }) => name === "25100015.csv");
  const stream = new PassThrough();
  stream.end(content.getData());
  let lines = 0;
  await processData(
    stream,
    ({ ref_date, geo, class_of_electricity_producer, type_of_electricity_generation, value = 0 }) => {
      const code = REGIONS.find(({ name }) => name === geo)?.subdivision;
      const period = ref_date.toString();
      if (
        code &&
        period >= "2019-01" &&
        class_of_electricity_producer === "Total all classes of electricity producer"
      ) {
        const region = `CA-${code}`;
        if (!aggregates[region]) aggregates[region] = {};
        if (!aggregates[region][period])
          aggregates[region][period] = {
            mix: { ...EMPTY_MIX },
            importedTWh: 0,
            generatedTWh: 0,
          };
        const generations: Partial<{ [k in keyof typeof IMPACTS]: number }> = {};
        if (type_of_electricity_generation === "Solar") generations["Solar"] = +value;
        if (type_of_electricity_generation === "Wind power turbine") generations["Wind"] = +value;
        if (type_of_electricity_generation === "Nuclear steam turbine") generations["Nuclear"] = +value;
        if (type_of_electricity_generation === "Hydraulic turbine") generations["Hydro"] = +value;
        if (type_of_electricity_generation === "Total electricity production from combustible fuels") {
          // Approximating energy breakdown from country energy mix
          const fossilFuelRatio = Object.entries(aggregates["CA"][period].mix)
            .filter(([energy]) => FOSSIL_FUELS.includes(energy as any))
            .reduce((a, [, v]) => a + v, 0);
          for (const energy of FOSSIL_FUELS)
            generations[energy] = (+value * aggregates["CA"][period].mix[energy]) / fossilFuelRatio;
        }
        for (let [variable, value] of Object.entries(generations)) {
          value /= 1000000; // MWh -> TWh
          aggregates[region][period].mix[variable as keyof Mix<Energy>] += value;
          aggregates[region][period].generatedTWh += +value;
        }
        lines++;
      }
    }
  );
  finalizeSubdivisionMix(aggregates, "CA");
  process.stdout.write(`${lines} lines processed\n`);
};

const fetchUSMix = async (aggregates: Aggregates) => {
  const FUEL_TYPES: Record<string, Energy> = {
    BIO: "Bioenergy",
    COW: "Coal",
    NGO: "Gas",
    HYC: "Hydro",
    HPS: "Hydro",
    NUC: "Nuclear",
    PET: "Other Fossil",
    OTH: "Other Fossil",
    GEO: "Other Renewables",
    SUN: "Solar",
    WND: "Wind",
  };
  const API_KEY = "sEvGqi4nirqeQq5PUiwD5fk4aUm6U5ljGt6cuGZO";
  let data;
  let offset = 0;
  do {
    ({
      response: { data },
    } = await (
      await fetch(`https://api.eia.gov/v2/electricity/electric-power-operational-data/data/?api_key=${API_KEY}`, {
        headers: {
          "x-params": JSON.stringify({
            frequency: "monthly",
            data: ["generation"],
            facets: {
              sectorid: ["99"],
              fueltypeid: Object.keys(FUEL_TYPES),
              location: REGIONS.filter(({ "alpha-2": a2, type }) => a2 === "US" && type === "subdivision").map(
                ({ subdivision }) => subdivision
              ),
            },
            sort: [{ column: "period", direction: "asc" }],
            start: "2019-01",
            offset,
            length: 5000,
          }),
        },
      })
    ).json());
    offset += data.length;
    for (const { period, location, fueltypeid, generation } of data) {
      const region = `US-${location}`;
      if (!aggregates[region]) aggregates[region] = {};
      if (!aggregates[region][period])
        aggregates[region][period] = {
          mix: { ...EMPTY_MIX },
          importedTWh: 0,
          generatedTWh: 0,
        };
      aggregates[region][period].mix[FUEL_TYPES[fueltypeid]] += generation / 1000;
      aggregates[region][period].generatedTWh += generation / 1000;
    }
  } while (data.length);
  finalizeSubdivisionMix(aggregates, "US");
  process.stdout.write(`${offset} lines processed\n`);
};

const exportFactorsAndMixes = (aggregates: Aggregates) => {
  process.stdout.write(`Exporting factors and mixes...\n`);
  const exports: {
    name: string;
    group: string[];
    filter: (region: string) => boolean;
    data: Record<string, any>;
  }[] = [
    { name: "world-yearly", group: ["year"], filter: isCountry, data: {} },
    { name: "continent-yearly", group: ["continent", "year"], filter: isCountry, data: {} },
    { name: "country-yearly", group: ["country", "year"], filter: isCountry, data: {} },
    {
      name: "subdivision-yearly",
      group: ["subdivision", "year"],
      filter: isSubdivision,
      data: {},
    },
    { name: "world-monthly", group: ["period"], filter: isCountry, data: {} },
    { name: "continent-monthly", group: ["continent", "period"], filter: isCountry, data: {} },
    { name: "country-monthly", group: ["country", "period"], filter: isCountry, data: {} },
    {
      name: "subdivision-monthly",
      group: ["subdivision", "period"],
      filter: isSubdivision,
      data: {},
    },
  ];
  for (let year = MIN_YEAR; year <= CURRENT_YEAR; year++) {
    const lastMonth = year === CURRENT_YEAR ? CURRENT_MONTH - 1 : 11;
    for (let month = 0; month <= lastMonth; month++) {
      const period = new Date(Date.UTC(year, month, 1)).toISOString().substring(0, 7);
      for (const exp of exports) {
        for (const region of Object.keys(aggregates).filter(exp.filter)) {
          const { continent: code } = REGIONS.find(({ "alpha-2": alpha2 }) => alpha2 === region) ?? {};
          const continent = REGIONS.filter(({ type }) => type === "continent").find(
            ({ continent }) => continent === code
          )?.name;
          const group = exp.group.reduce(
            (acc, key) => ({ ...acc, [key]: { year, period, continent, country: region, subdivision: region }[key] }),
            {}
          );
          const key = Object.entries(group)
            .sort(([a, _], [b, __]) => a.localeCompare(b))
            .map(([_, v]) => v)
            .join("-");
          const { generatedTWh, importedTWh } = aggregates[region][period];
          const weight = generatedTWh + importedTWh;
          exp.data[key] = {
            group,
            ...combine({
              target: exp.data[key] ?? EMPTY_MIX,
              source: aggregates[region][period].mix,
              sourceCoeff: weight,
            }),
            weight: (exp.data[key]?.weight ?? 0) + weight,
          };
        }
      }
    }
  }
  for (const exp of exports) {
    const mixes = {
      global: new Array<Record<string, any>>(),
      green: new Array<Record<string, any>>(),
    };
    const impacts = {
      global: new Array<Record<string, any>>(),
      green: new Array<Record<string, any>>(),
    };
    for (const { group, weight, ...mix } of Object.keys(exp.data)
      .sort()
      .map((k) => exp.data[k])) {
      const globalMix = { ...group, ...mix };
      const greenMix = { ...group, ...mix };
      // Mix normalization
      for (const energy of ENERGIES) {
        globalMix[energy] = mix[energy] / weight;
        if (GREEN_ENERGIES.includes(energy as GreenEnergy)) greenMix[energy] = globalMix[energy];
        else delete greenMix[energy];
      }
      mixes.global.push(globalMix);
      // Green mix normalization
      const greenRatio = GREEN_ENERGIES.reduce((a, v) => a + greenMix[v], 0);
      for (const energy of GREEN_ENERGIES) greenMix[energy] = greenMix[energy] / greenRatio;
      mixes.green.push(greenMix);
      // Global energy impacts
      impacts.global.push(
        ENERGIES.reduce(
          (target, energy) =>
            combine({
              target,
              source: IMPACTS[energy],
              sourceCoeff: globalMix[energy],
            }),
          { ...group, ...EMPTY_IMPACTS }
        )
      );
      // Green energy impacts
      impacts.green.push(
        GREEN_ENERGIES.reduce(
          (target, energy) =>
            combine({
              target,
              source: IMPACTS[energy],
              sourceCoeff: globalMix[energy],
            }),
          { ...group, ...EMPTY_IMPACTS }
        )
      );
      ENERGIES.forEach(
        (energy) =>
          (mixes.global[mixes.global.length - 1][energy] = roundRatio(mixes.global[mixes.global.length - 1][energy]))
      );
      GREEN_ENERGIES.forEach(
        (energy) =>
          (mixes.green[mixes.green.length - 1][energy] = roundRatio(mixes.green[mixes.green.length - 1][energy]))
      );
      Object.keys(EMPTY_IMPACTS).forEach(
        (impact) =>
          (impacts.global[impacts.global.length - 1][impact] = roundNumber(
            impacts.global[impacts.global.length - 1][impact]
          ))
      );
      Object.keys(EMPTY_IMPACTS).forEach(
        (impact) =>
          (impacts.green[impacts.green.length - 1][impact] = roundNumber(
            impacts.green[impacts.green.length - 1][impact]
          ))
      );
    }
    writeFileSync(`./data/mix/${exp.name}.json`, JSON.stringify(groupBy(mixes.global, exp.group), null, 2));
    exportToCsv(`./data/mix/${exp.name}.csv`, mixes.global);
    writeFileSync(`./data/mix/${exp.name}-green.json`, JSON.stringify(groupBy(mixes.green, exp.group), null, 2));
    exportToCsv(`./data/mix/${exp.name}-green.csv`, mixes.global);
    writeFileSync(`./data/factor/${exp.name}.json`, JSON.stringify(groupBy(impacts.global, exp.group), null, 2));
    exportToCsv(`./data/factor/${exp.name}.csv`, impacts.global);
    writeFileSync(`./data/factor/${exp.name}-green.json`, JSON.stringify(groupBy(impacts.green, exp.group), null, 2));
    exportToCsv(`./data/factor/${exp.name}-green.csv`, impacts.green);
  }
};

const generateFactors = async () => {
  // Data aggregation
  const aggregates: Aggregates = {};
  process.stdout.write(`Generating world, continent and country energy mix...\n`);
  await fetchWorldFactors(aggregates);
  await sanitizeData(aggregates);
  process.stdout.write(`Generating canada province energy mix...`);
  await Mix(aggregates);
  process.stdout.write(`Generating US states energy mix...`);
  await fetchUSMix(aggregates);
  await sanitizeData(aggregates);
  let updates = 0;
  process.stdout.write(`Taking energy imports into account... `);
  for (const [region, periods] of Object.entries(aggregates).filter(([region, _]) => isCountry(region))) {
    for (const [period, data] of Object.entries(periods)) {
      const { importedTWh, generatedTWh } = data;
      if (importedTWh > 0) {
        const countryContribution = generatedTWh / (generatedTWh + importedTWh);
        const continentContribution = importedTWh / (generatedTWh + importedTWh);
        const continentAggregate = aggregates[COUNTRY_EMBER_REGIONS[region]][period];
        data.mix = combine({
          target: data.mix ?? EMPTY_MIX,
          targetCoeff: countryContribution,
          source: continentAggregate.mix,
          sourceCoeff: continentContribution,
        });
        updates++;
      }
    }
  }
  process.stdout.write(`${updates} updates\n`);
  exportFactorsAndMixes(aggregates);
};

const generateCountries = async () => {
  process.stdout.write(`Computing geographic data...\n`);
  // Continents
  const continents = REGIONS.filter(({ type }) => type === "continent")
    .map(({ continent: code, name }) => ({ code, name }))
    .sort((a, b) => a.code.localeCompare(b.code));
  // Countries
  const countries = REGIONS.filter(({ type }) => type === "country")
    .map(({ "alpha-3": a3, "alpha-2": a2, name, continent }) => ({
      name,
      "alpha-3": a3,
      "alpha-2": a2,
      continent: continents.find(({ code }) => code === continent)?.name,
    }))
    .sort((a, b) => a["alpha-2"].localeCompare(b["alpha-2"]));
  // Distances
  const countryToCountry = [];
  const regionToRegion = [];
  const userToDatacenter = [];
  for (const origin of REGIONS) {
    for (const destination of REGIONS) {
      const distance = computeDistance(origin, destination);
      // country to country distance
      if (origin.type === destination.type && origin.type === "country") {
        countryToCountry.push({ origin: origin["alpha-2"], destination: destination["alpha-2"], distance });
      }
      // region to region distance
      if (origin.type !== "continent" && destination.type !== "continent") {
        regionToRegion.push({
          origin: origin.type === "country" ? origin["alpha-2"] : `${origin["alpha-2"]}-${origin.subdivision}`,
          destination:
            destination.type === "country"
              ? destination["alpha-2"]
              : `${destination["alpha-2"]}-${destination.subdivision}`,
          distance,
        });
      }
    }
    // user to datacenter distance
    if (origin.type !== "continent") {
      const distance = Math.round(Math.sqrt(origin.area / Math.PI) * Math.pow(10, 3)) / Math.pow(10, 3);
      userToDatacenter.push({
        "alpha-2": origin.type === "country" ? origin["alpha-2"] : `${origin["alpha-2"]}-${origin.subdivision}`,
        distance,
      });
    }
  }
  process.stdout.write(`Exporting geographic data...\n`);
  exportToCsv(`./data/country/regions.csv`, REGIONS, [
    "continent",
    "alpha-2",
    "alpha-3",
    "subdivision",
    "name",
    "type",
    "area",
    "lat",
    "lon",
  ]);
  writeFileSync(`./data/country/continents.json`, JSON.stringify(continents, null, 2));
  exportToCsv(`./data/country/continents.csv`, continents);
  writeFileSync(`./data/country/countries.json`, JSON.stringify(countries, null, 2));
  exportToCsv(`./data/country/countries.csv`, countries);
  writeFileSync(
    `./data/country/country-to-country-distances.json`,
    JSON.stringify(
      countryToCountry.reduce<Record<string, number>>((a, { origin, destination, distance }) => {
        a[`${origin}${destination}`] = distance;
        return a;
      }, {}),
      null,
      2
    )
  );
  exportToCsv(`./data/country/country-to-country-distances.csv`, countryToCountry);
  writeFileSync(
    `./data/country/region-to-region-distances.json`,
    JSON.stringify(
      regionToRegion.reduce<Record<string, number>>((a, { origin, destination, distance }) => {
        a[`${origin}${destination}`] = distance;
        return a;
      }, {}),
      null,
      2
    )
  );
  exportToCsv(`./data/country/region-to-region-distances.csv`, regionToRegion);
  writeFileSync(
    `./data/country/user-to-datacenter-distances.json`,
    JSON.stringify(
      userToDatacenter.reduce<Record<string, number>>((a, { "alpha-2": a2, distance }) => {
        a[a2] = distance;
        return a;
      }, {}),
      null,
      2
    )
  );
  exportToCsv(`./data/country/user-to-datacenter-distances.csv`, userToDatacenter);
};

(async () => {
  await generateCountries();
  await generateFactors();
})();
