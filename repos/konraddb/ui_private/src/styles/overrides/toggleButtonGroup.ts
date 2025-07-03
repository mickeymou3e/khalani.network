import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const toggleButtonGroupOverrides = (): Partial<OverridesStyleRules> => ({
  styleOverrides: {
    grouped: {
      border: "none",

      "&.MuiToggleButtonGroup-grouped": {
        borderRadius: "2rem",
      },
    },
  },
});
