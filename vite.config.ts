import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "site",
  base: "/data/",
  publicDir: "../data",
  plugins: [react()],
  esbuild: { legalComments: "none" },
});
