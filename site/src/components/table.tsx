import { FC, useState } from "react";
import { Box, Stack } from "@mui/system";

const Arrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 0 384 512">
    <path
      fill="currentColor"
      d="M169.4 502.6c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 402.7 224 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 370.7L86.6 329.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128z"
    ></path>
  </svg>
);

export const Table: FC<{ headers: Record<string, string>; values: Record<string, string | number>[] }> = ({
  headers,
  values,
}) => {
  const [sort, setSort] = useState(1);
  return (
    <Box
      sx={{
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "border.primary",
        borderRadius: 2,
        maxHeight: "31rem",
        overflowY: "auto",
        table: {
          typography: "table",
          width: "100%",
          thead: {
            th: { px: 2, py: 1.5, textAlign: "left", position: "sticky", top: "0", bgcolor: "background.primary" },
          },
          tbody: {
            td: { px: 2, py: 1 },
            "tr:nth-of-type(even)": { bgcolor: "background.primary" },
          },
        },
      }}
    >
      <table cellPadding="0" cellSpacing="0">
        <thead>
          <tr>
            {Object.entries(headers).map(([k, v], index) => (
              <th key={k}>
                <Stack
                  sx={{
                    cursor: "pointer",
                    position: "relative",
                    svg: {
                      visibility: Math.abs(sort) === index + 1 ? "visible" : "hidden",
                      transform: `rotate(${sort > 0 ? 0 : 180}deg)`,
                    },
                  }}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  onClick={() => setSort(Math.abs(sort) === index + 1 ? -sort : index + 1)}
                >
                  <Box>{v}</Box>
                  <Arrow />
                </Stack>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {values
            .slice()
            .sort((a, b) => {
              const idx = Math.abs(sort) - 1;
              const direction = sort / Math.abs(sort);
              const keys = Object.keys(headers);
              return direction * String(a[keys[idx]]).localeCompare(String(b[keys[idx]]));
            })
            .map((value, index) => (
              <tr key={index}>
                {Object.entries(headers).map(([k, v]) => (
                  <td key={k}>{value[k]}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </Box>
  );
};
