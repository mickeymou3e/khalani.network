import { alpha, Theme } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const chipOverrides = (theme: Theme): Partial<OverridesStyleRules> => ({
  styleOverrides: {
    root: {
      padding: "0.5rem 0.25rem",
      borderRadius: "0.5rem",
      height: "2.5rem",
      textTransform: "capitalize",

      "&.MuiChip-sizeMedium": {
        height: "2.5rem",
      },
      "&.MuiChip-sizeSmall": {
        height: "2rem",
      },

      "&.MuiChip-label": {
        padding: 0,
      },

      "&.MuiChip-colorWarning": {
        color: theme.palette.alert.orange,
        backgroundColor: alpha(theme.palette.alert.orange, 0.1),
      },

      "&.MuiChip-colorError": {
        color: theme.palette.alert.red,
        backgroundColor: alpha(theme.palette.alert.red, 0.1),
      },

      "&.MuiChip-colorInfo": {
        color: theme.palette.alert.blue,
        backgroundColor: alpha(theme.palette.alert.blue, 0.1),
      },

      "&.MuiChip-colorSuccess": {
        color: theme.palette.alert.green,
        backgroundColor: alpha(theme.palette.alert.green, 0.1),
      },

      "&.MuiChip-colorPrimary": {
        color: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      },
    },
  },
});
