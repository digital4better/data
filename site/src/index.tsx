import React from "react";
import { hydrateRoot } from "react-dom/client";
import { App } from "./app";
const props = JSON.parse(document.getElementById("page-data")!.textContent!);
hydrateRoot(document.getElementById("root")!, <App {...props} />);
