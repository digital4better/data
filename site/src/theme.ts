import { createTheme } from "@mui/system";

const fontFamily = [
  "ui-sans-serif",
  "system-ui",
  "sans-serif",
  "Apple Color Emoji",
  "Segoe UI Emoji",
  "Segoe UI Symbol",
  "Noto Color Emoji",
].join(",");

export const theme = createTheme({
  typography: {
    header: {
      color: "white",
      fontFamily,
      fontSize: "1.25rem",
      lineHeight: "1.75rem",
      "@media (max-width:600px)": {
        fontSize: "1rem",
        lineHeight: "1.5rem",
      },
    },
    title: {
      fontWeight: "bold",
      fontSize: "2.25rem",
      lineHeight: "2.5rem",
      fontFamily,
      "@media (max-width:600px)": {
        fontSize: "1.25rem",
        lineHeight: "1.75rem",
      },
    },
    subtitle: {
      color: "#444444",
      fontSize: "1.5rem",
      fontWeight: "normal",
      fontFamily,
    },
    table: {
      color: "#444444",
      fontFamily,
      fontSize: "0.875rem",
    },
    body: {
      color: "#444444",
      fontFamily,
      fontSize: "0.875rem",
    },
    label: {
      color: "#888888",
      fontFamily,
      fontSize: "0.75rem",
    },
  },
  palette: {
    background: {
      primary: "#f5f5f5",
      secondary: "#003878",
      paper: "#ffffff",
    },
    border: {
      primary: "#e7e7e7",
    },
  },
});
