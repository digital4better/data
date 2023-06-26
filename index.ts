import { get } from "https";
import { createInterface } from "readline";
import { appendFileSync, writeFileSync } from "fs";
import * as countries from "./data/country/countries.json";
import * as impacts from "./data/energy/energy-impacts.json";

const MIN_YEAR = 2019;
const CURRENT_YEAR = new Date().getUTCFullYear();
const GREEN_ENERGIES = ["Bioenergy", "Hydro", "Solar", "Wind"];

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
const isCountry = (region: string) => !isWorld(region) && !isContinent(region);
const REGION_FILTERS = {
  world: isWorld,
  continent: isContinent,
  country: isCountry,
};

const fetchAndScrap = async (url: string, regex: RegExp) =>
  new Promise((resolve) =>
    get(url, (response) => {
      let body = "";
      response.on("data", (response) => (body += response.toString()));
      response.on("end", () => resolve(regex.exec(body)?.[0]));
    })
  );

const fetchAndProcess = async (url: string, process: (values: Record<string, string | number | Date>) => void) =>
  new Promise((resolve) => {
    get(url, async (response) => {
      const rl = createInterface({
        input: response,
        crlfDelay: Infinity,
      });
      const headers: string[] = [];
      for await (const line of rl) {
        const values = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
        if (headers.length === 0) headers.push(...values.map((header) => header.toLowerCase().replace(/\s+/g, "_")));
        else {
          process(
            headers.reduce<Record<string, string | number | Date>>((acc, header, index) => {
              const value = values[index];
              if (value === "") acc[header] = null;
              else if (/^\d{4}-\d{2}-\d{2}$/i.test(value)) acc[header] = new Date(value);
              else if (/^-?\d+(?:\.\d+)?$/i.test(value)) acc[header] = parseFloat(value);
              else acc[header] = value;
              return acc;
            }, {})
          );
        }
      }
      resolve(true);
    });
  });

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

const combineImpacts = ({
  target = { ...EMPTY_IMPACTS },
  source = { ...EMPTY_IMPACTS },
  targetCoeff = 1,
  sourceCoeff = 1,
}: {
  target?: Impacts;
  source?: Impacts;
  targetCoeff?: number;
  sourceCoeff?: number;
}): Impacts => {
  const impacts = { ...EMPTY_IMPACTS };
  for (const k of Object.keys(source) as (keyof Impacts)[]) {
    impacts[k] = target[k] * targetCoeff + source[k] * sourceCoeff;
  }
  return impacts;
};

type Aggregate = {
  global: Impacts;
  green: Impacts;
  greenRatio: number;
  importedKWh: number;
  generatedKWh: number;
};

const cloneAggregate = (impacts: Aggregate): Aggregate => ({
  ...impacts,
  global: { ...impacts.global },
  green: { ...impacts.green },
});

const groupBy = (values: any[], fields: string[]) => {
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

(async () => {
  // Data aggregation
  const aggregates: {
    [region: string]: {
      [period: string]: Aggregate;
    };
  } = {};
  // Last month of available data
  let lastAvailableMonth = 0;
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
          variable: keyof typeof impacts;
          unit: string;
          value: number;
        };
      const yearly = !!year;
      const period = yearly ? `${year}` : date.toISOString().substring(0, 7);
      const country = area_type === "Country";
      const region = country ? countries.find(({ "alpha-3": alpha3 }) => alpha3 === country_code)?.["alpha-2"] : area;
      // Unknown area, stopping process
      if (!region) throw new Error(`Unknown area: ${country_code ?? area}`);
      // Dropping early years
      if (year && year < MIN_YEAR) return;
      if (date && date.getUTCFullYear() < MIN_YEAR) return;
      // Setting last month
      if (date && date.getUTCFullYear() === CURRENT_YEAR)
        lastAvailableMonth = Math.max(lastAvailableMonth, date.getUTCMonth());
      // Dropping unknown regions
      if (!country && isCountry(region)) return;
      // Filling country continent association
      if (country) COUNTRY_EMBER_REGIONS[region] = ember_region;
      // Initializing default values
      if (!aggregates[region]) aggregates[region] = {};
      if (!aggregates[region][period])
        aggregates[region][period] = {
          global: { ...EMPTY_IMPACTS },
          green: { ...EMPTY_IMPACTS },
          greenRatio: 0,
          importedKWh: 0,
          generatedKWh: 0,
        };
      if (category === "Electricity generation") {
        if (subcategory === "Fuel" && unit === "%") {
          aggregates[region][period].global = combineImpacts({
            target: aggregates[region][period].global,
            source: impacts[variable],
            sourceCoeff: value / 100,
          });
          if (GREEN_ENERGIES.indexOf(variable) >= 0) {
            aggregates[region][period].green = combineImpacts({
              target: aggregates[region][period].green,
              source: impacts[variable],
              sourceCoeff: value / 100,
            });
            aggregates[region][period].greenRatio += value / 100;
          }
        }
        if (subcategory === "Total" && unit === "TWh") {
          aggregates[region][period].generatedKWh = value;
        }
      } else if (category === "Electricity imports" && unit === "TWh") {
        aggregates[region][period].importedKWh = value;
      }
      lines++;
    });
    process.stdout.write(`${lines} lines processed\n`);
  }
  const passes: { yearly: boolean; scope: keyof typeof REGION_FILTERS }[] = [
    { yearly: true, scope: "world" },
    { yearly: true, scope: "continent" },
    { yearly: true, scope: "country" },
    { yearly: false, scope: "world" },
    { yearly: false, scope: "continent" },
    { yearly: false, scope: "country" },
  ];
  process.stdout.write(`Filling missing data\n`);
  for (const { yearly, scope } of passes) {
    let additions = 0;
    process.stdout.write(`- ${yearly ? "yearly" : "monthly"} ${scope} data... `);
    for (const region of Object.keys(aggregates).filter((region) => REGION_FILTERS[scope](region))) {
      let last: Aggregate;
      const fill = (period: string): Aggregate => {
        if (!aggregates[region][period]) {
          if (last) aggregates[region][period] = cloneAggregate(last);
          else if (scope === "continent") aggregates[region][period] = cloneAggregate(aggregates[EMBER_WORLD][period]);
          else if (scope === "country")
            aggregates[region][period] = cloneAggregate(aggregates[COUNTRY_EMBER_REGIONS[region]][period]);
          else throw new Error(`Cannot fill missing ${scope} data for region ${region} and period ${period}`);
          additions++;
        }
        return aggregates[region][period];
      };
      for (let year = MIN_YEAR; year <= CURRENT_YEAR; year++) {
        if (yearly) {
          last = fill(`${year}`);
        } else {
          for (let month = 0; month <= 11; month++) {
            last = fill(new Date(Date.UTC(year, month, 1)).toISOString().substring(0, 7));
          }
        }
      }
    }
    process.stdout.write(`${additions} additions\n`);
  }
  process.stdout.write(`Applying green energy ratio correction...\n`);
  for (const [region, periods] of Object.entries(aggregates)) {
    for (const [period, { greenRatio }] of Object.entries(periods)) {
      if (greenRatio > 0) {
        aggregates[region][period].green = combineImpacts({
          target: aggregates[region][period].green,
          targetCoeff: 1 / greenRatio,
        });
      }
    }
  }
  let updates = 0;
  process.stdout.write(`Taking energy imports into account... `);
  for (const [region, periods] of Object.entries(aggregates).filter(([region, _]) => isCountry(region))) {
    for (const [period, data] of Object.entries(periods)) {
      const { importedKWh, generatedKWh } = data;
      if (importedKWh > 0) {
        const countryContribution = generatedKWh / (generatedKWh + importedKWh);
        const continentContribution = importedKWh / (generatedKWh + importedKWh);
        const continentImpacts = aggregates[COUNTRY_EMBER_REGIONS[region]][period];
        data.global = combineImpacts({
          target: data.global,
          targetCoeff: countryContribution,
          source: continentImpacts.global,
          sourceCoeff: continentContribution,
        });
        data.green = combineImpacts({
          target: data.green,
          targetCoeff: countryContribution,
          source: continentImpacts.green,
          sourceCoeff: continentContribution,
        });
        updates++;
      }
    }
  }
  process.stdout.write(`${updates} updates\n`);
  let additions = 0;
  process.stdout.write(`Filling missing green data...`);
  for (const [region, periods] of Object.entries(aggregates).filter(([region, _]) => isCountry(region))) {
    let last: Impacts;
    for (let year = MIN_YEAR; year <= CURRENT_YEAR; year++) {
      for (let month = 0; month <= 11; month++) {
        const period = new Date(Date.UTC(year, month, 1)).toISOString().substring(0, 7);
        if (aggregates[region][period].green.gwp === 0) {
          // Taking previous green energy impacts
          if (last && last.gwp > 0) aggregates[region][period].green = { ...last };
          // Or yearly country green energy impacts
          else aggregates[region][period].green = { ...aggregates[region][`${year}`].green };
          additions++;
        }
        last = aggregates[region][period].green;
      }
    }
  }
  process.stdout.write(`${additions} additions\n`);
  for (const kind of ["global", "green"]) {
    process.stdout.write(`Exporting ${kind} data...\n`);
    const exports: {
      name: string;
      group: string[];
      data: Record<string, Impacts & { count: number } & any>;
    }[] = [
      { name: "world-yearly", group: ["year"], data: {} },
      { name: "continent-yearly", group: ["continent", "year"], data: {} },
      { name: "country-yearly", group: ["country", "year"], data: {} },
      { name: "world-monthly", group: ["period"], data: {} },
      { name: "continent-monthly", group: ["continent", "period"], data: {} },
      { name: "country-monthly", group: ["country", "period"], data: {} },
    ];
    for (let year = MIN_YEAR; year <= CURRENT_YEAR; year++) {
      const lastMonth = year === CURRENT_YEAR ? lastAvailableMonth : 11;
      for (let month = 0; month <= lastMonth; month++) {
        const period = new Date(Date.UTC(year, month, 1)).toISOString().substring(0, 7);
        for (const country of Object.keys(aggregates).filter(isCountry)) {
          const { continent } = countries.find(({ "alpha-2": alpha2 }) => alpha2 === country);
          for (const exp of exports) {
            const group = exp.group.reduce(
              (acc, key) => ({ ...acc, [key]: { year, period, continent, country }[key] }),
              {}
            );
            const key = Object.entries(group)
              .sort(([a, _], [b, __]) => a.localeCompare(b))
              .map(([_, v]) => v)
              .join("-");
            exp.data[key] = {
              ...group,
              ...combineImpacts({
                target: exp.data[key],
                source: aggregates[country][period][kind as keyof Aggregate] as Impacts,
              }),
              count: (exp.data[key]?.count ?? 0) + 1,
            };
          }
        }
      }
    }
    for (const exp of exports) {
      // Exporting to json file
      const data = Object.values(exp.data).map(({ count, ...data }) => {
        for (const impact of Object.keys(EMPTY_IMPACTS)) data[impact] /= count;
        return data;
      });
      writeFileSync(
        `./data/factor/${exp.name}${kind === "green" ? "-green" : ""}.json`,
        JSON.stringify(groupBy(data, exp.group), null, 2)
      );
      // Exporting to csv file
      const headers = Object.keys(Object.values(data)[0]);
      writeFileSync(`./data/factor/${exp.name}${kind === "green" ? "-green" : ""}.csv`, headers.join(";") + "\r\n");
      for (const line of Object.values(data))
        appendFileSync(
          `./data/factor/${exp.name}${kind === "green" ? "-green" : ""}.csv`,
          headers.map((header) => line[header].toString().replace(".", ",")).join(";") + "\r\n"
        );
    }
  }
})();
