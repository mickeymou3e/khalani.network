import { Theme } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const checkboxOverrides = (
  theme: Theme
): Partial<OverridesStyleRules> => ({
  styleOverrides: {
    root: {
      width: "1.125rem",
      color: theme.palette.primary.gray2,

      "&.Mui-disabled": {
        color: theme.palette.primary.gray3,
      },

      "&:hover": {
        backgroundColor: "transparent",
      },
    },
  },
});
