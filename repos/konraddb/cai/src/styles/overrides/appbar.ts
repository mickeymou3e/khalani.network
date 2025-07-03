import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const appBarOverrides = (): Partial<OverridesStyleRules> => ({
  styleOverrides: {
    root: {
      boxShadow: "none",
    },
  },
});
