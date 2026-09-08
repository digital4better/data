import React from "react";
import { renderToString } from "react-dom/server";
import { App } from "./app";
export const render = (props: React.ComponentProps<typeof App>) => renderToString(<App {...props} />);
