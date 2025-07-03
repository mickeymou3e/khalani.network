import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const cssBaselineOverrides = (
  theme: Theme,
  fontFamily: string
): Partial<OverridesStyleRules> => ({
  styleOverrides: {
    body: {
      fontFamily,
      overflowX: "hidden",
      overflowY: "scroll",
      color: theme.palette.primary.main,
    },

    "&::-webkit-scrollbar": {
      width: "0.5rem",
      height: "0.5rem",
      borderRadius: "0.5rem",
    },

    "&::-webkit-scrollbar-track": {
      background: alpha(
        theme.palette.primary.main,
        theme.custom.opacity._5percent
      ),
      borderRadius: "0.5rem",
    },

    "&::-webkit-scrollbar-thumb": {
      background: theme.palette.primary.main,
      borderWidth: "0",
      borderRadius: "0.5rem",
      backgroundClip: "content-box",
    },
  },
});
