import React, { FC, useEffect, useState } from "react";
import { Box, Container, GlobalStyles, Stack, ThemeProvider } from "@mui/system";
import regions from "../../data/country/regions.json";
import { Map } from "./components/map";
import { Header } from "./components/header";
import { Table } from "./components/table";
import { theme } from "./theme";
import { Select } from "./components/select";

const ZOOMS: { [k: string]: { label: string; scale: number; x: number; y: number } } = {
  WO: { label: "World", scale: 1, x: 0, y: 0 },
  AF: { label: "Africa", scale: 2.2, x: -570, y: -470 },
  NA: { label: "North America", scale: 2.22, x: 0, y: -260 },
  SA: { label: "South America", scale: 2.1, x: -160, y: -570 },
  AS: { label: "Asia", scale: 2.3, x: -950, y: -380 },
  EU: { label: "Europe", scale: 3.2, x: -940, y: -395 },
  OC: { label: "Oceania", scale: 3.2, x: -1860, y: -1050 },
};

const IMPACTS: Record<string, string> = {
  adpe: "Abiotic Depletion Potential (kgSbe)",
  ap: "Acidification Power (kgSO\u2082e)",
  ctue: "Freshwater ecotoxicity (CTUe)",
  "ctuh-c": "Human toxicity, cancer (CTUh)",
  "ctuh-nc": "Human toxicity, non-cancer (CTUh)",
  gwp: "Global Warming Potential (kgCO\u2082e)",
  ir: "Ionising Radiation (kgU235e)",
  pm: "Particulate Matter",
  wu: "Water use (m\u00B3)",
};

export const App: FC = () => {
  const [factors, setFactors] = useState<{
    [country: string]: { [year: string]: { [k: keyof typeof IMPACTS]: number } };
  }>({});
  const [paths, setPaths] = useState<{ [country: string]: string }>({});
  const [emissions, setEmissions] = useState({});
  const [data, setData] = useState([]);
  const [year, setYear] = useState("2024");
  const [impact, setImpact] = useState("gwp");
  const [zoom, setZoom] = useState("WO");
  useEffect(() => {
    (async () => {
      // @ts-ignore
      const base = import.meta.env.BASE_URL;
      setFactors(await (await fetch(`${base}factor/country-yearly.json`)).json());
      setPaths(await (await fetch(`${base}country/regions-paths.json`)).json());
    })();
  }, []);
  useEffect(() => {
    setEmissions(
      Object.fromEntries(
        Object.entries(factors)
          .filter(([iso]) => {
            const country = regions.find(({ "alpha-2": a2 }) => a2 === iso);
            const continent = regions.find(
              ({ continent, type }) => type === "continent" && continent === country.continent
            );
            return zoom === "WO" || continent.continent === zoom;
          })
          .map(([region, yearly]) => [region, yearly[year][impact]])
      )
    );
    setData(
      Object.entries(factors)
        .map(([iso, yearly]) => {
          const country = regions.find(({ "alpha-2": a2 }) => a2 === iso);
          const continent = regions.find(
            ({ continent, type }) => type === "continent" && continent === country.continent
          );
          return {
            iso,
            name: country?.name,
            continent: continent?.name,
            visible: zoom === "WO" || continent.continent === zoom,
            ...yearly[year],
          };
        })
        .filter(({ visible }) => visible)
    );
  }, [factors, year, impact, zoom]);
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles styles={{ "*": { padding: 0, margin: 0 } }} />
      <Header />
      <Box sx={{ bgcolor: "background.primary", p: 4 }}>
        <Container maxWidth="lg" disableGutters>
          <Stack spacing={2}>
            <Box sx={{ typography: "subtitle" }} component="h2">
              Electricity consumption impacts per kWh
            </Box>
            <Box sx={{ borderRadius: 4, bgcolor: "background.paper", overflow: "hidden" }}>
              <Map paths={paths} emissions={emissions} zoom={ZOOMS[zoom]} />
            </Box>
            <Stack
              direction="row"
              sx={{
                borderRadius: 4,
                bgcolor: "background.paper",
                px: 2,
                py: 1,
                typography: "body",
                flexWrap: "wrap",
                label: { mb: 0.5, display: "inline-block", typography: "label" },
              }}
              spacing={3}
            >
              <Box>
                <Box component="label" htmlFor="impact">
                  Impact
                </Box>
                <Select
                  name="impact"
                  value={impact}
                  onChange={setImpact}
                  options={Object.entries(IMPACTS).map(([value, label]) => ({ label, value }))}
                />
              </Box>
              <Box>
                <Box component="label" htmlFor="period">
                  Period
                </Box>
                <Select
                  name="period"
                  value={year}
                  onChange={setYear}
                  options={["2024", "2023", "2022", "2021", "2020"].map((year) => ({ label: year, value: year }))}
                />
              </Box>
              <Box>
                <Box component="label" htmlFor="zone">
                  Zone
                </Box>
                <Select
                  name="zone"
                  value={zoom}
                  onChange={setZoom}
                  options={Object.entries(ZOOMS).map(([value, { label }]) => ({ label, value }))}
                />
              </Box>
            </Stack>
            <Box sx={{ borderRadius: 4, bgcolor: "background.paper", p: 2 }}>
              <Table
                headers={{ iso: "ISO", name: "Country", continent: "Continent", [impact]: "Impact per kWh" }}
                values={data}
              />
            </Box>
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
  );
};
