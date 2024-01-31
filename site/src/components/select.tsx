import React, { FC } from "react";
import { Box } from "@mui/system";

export const Select: FC<{
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}> = ({ name, value, onChange, options }) => (
  <Box
    sx={{
      select: {
        appearance: "none",
        borderRadius: 2,
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "border.primary",
        py: 1,
        px: 2,
        fontsize: "inherit",
        fontFamily: "inherit",
        color: "inherit",
      },
    }}
  >
    <select name={name} value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  </Box>
);
