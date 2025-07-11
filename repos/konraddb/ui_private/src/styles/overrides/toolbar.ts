import { Theme } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const toolbarOverrides = (
  theme: Theme
): Partial<OverridesStyleRules> => ({
  styleOverrides: {
    root: {
      backgroundColor: theme.palette.primary.background,
      height: "5rem",
      padding: "1rem 3rem",
    },
  },
});
