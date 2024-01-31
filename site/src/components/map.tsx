import React, { useState } from "react";
import { Box } from "@mui/system";

const intensity = [
  "#2AA364",
  "#46B46A",
  "#84BB78",
  "#9FC17F",
  "#D6D98D",
  "#E6D27E",
  "#D2A63E",
  "#C28A3C",
  "#B16E3A",
  "#9F5238",
  "#8E3636",
  "#6F241F",
  "#4F1217",
  "#2F010F",
  "#0F0007",
  "#000000",
];

const DEFAULT_VIEW = [0, 130, 800, 400];

export const Map = ({
  paths,
  emissions,
  zoom = { scale: 1, x: 0, y: 0 },
}: {
  paths: Record<string, string>;
  emissions: { [region: string]: number };
  zoom?: { scale: number; x: number; y: number };
}) => {
  const [viewBox, setViewBox] = useState<number[]>(DEFAULT_VIEW);
  const max = Math.max(...Object.values(emissions));
  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        svg: {
          display: "block",
          circle: {
            cursor: "pointer",
            vectorEffect: "non-scaling-stroke",
            stroke: "#fff",
            strokeWidth: "2",
            transition: "fill 200ms, r 300ms",
          },
          path: {
            strokeWidth: "0.5",
            transition: "fill 250ms",
            vectorEffect: "non-scaling-stroke",
          },
          g: {
            transition: "transform 1000ms ease",
          },
        },
        position: "relative",
      }}
    >
      <svg version="1.1" viewBox={viewBox.join(" ")} xmlns="http://www.w3.org/2000/svg">
        <g transform={`translate(${zoom.x}, ${zoom.y}) scale(${zoom.scale})`}>
          {Object.entries(paths).map(([k, v]) => (
            <path
              key={k}
              id={k}
              d={v}
              fill={
                emissions[k.slice(0, 2)] >= 0
                  ? intensity[Math.round((intensity.length * emissions[k.slice(0, 2)]) / max)]
                  : "#ddd"
              }
              stroke="#fff"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
              onClick={() => alert(`${k} : ${emissions[k]}`)}
            />
          ))}
        </g>
      </svg>
    </Box>
  );
};
