import { alpha, Theme } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const toggleButtonOverrides = (
  theme: Theme
): Partial<OverridesStyleRules> => ({
  styleOverrides: {
    root: {
      color: theme.palette.primary.main,
      "&.MuiToggleButton-sizeSmall": {
        fontSize: "0.875rem",
        height: "2rem",
        padding: "0.25rem 0.5rem",
        textTransform: "lowercase",

        "&:not(:last-of-type)": {
          marginRight: "0.5rem",
        },
      },

      "&.MuiToggleButton-sizeMedium, &.MuiToggleButton-sizeLarge": {
        fontSize: "0.875rem",
        height: "3rem",
        padding: "0.75rem 2rem",
        textTransform: "uppercase",

        "&:not(:last-of-type)": {
          marginRight: "1rem",
        },
      },

      "&.Mui-selected, &:hover, &.Mui-selected:hover": {
        color: theme.palette.primary.main,
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.custom.opacity._5percent
        ),
      },
    },
  },
});
