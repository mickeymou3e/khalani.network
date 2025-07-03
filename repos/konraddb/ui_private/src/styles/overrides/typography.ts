import { Theme } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const typographyOverrides = (
  theme: Theme
): Partial<OverridesStyleRules> => ({
  styleOverrides: {
    root: {
      textTransform: "none",
      display: "flex",
      alignItems: "center",
      color: theme.palette.primary.main,
    },
  },
});
