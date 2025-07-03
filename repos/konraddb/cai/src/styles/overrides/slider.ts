import { Theme } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const sliderOverrides = (
  theme: Theme
): Partial<OverridesStyleRules> => ({
  styleOverrides: {
    root: {
      "& .MuiSlider-thumb": {
        boxShadow: "none",

        "&.Mui-focusVisible, .MuiSlider-thumb:hover": {
          boxShadow: "none",
        },
      },
    },
    rail: {
      height: "0.5rem",
      background: theme.palette.common.white,
      border: "none",
    },
    track: {
      height: "0.5rem",
      background: theme.palette.common.white,
      border: "none",
    },
    thumb: {
      color: theme.palette.common.white,
      width: "1.5rem",
      height: "1.5rem",
    },
    mark: {
      background: "none",
    },
    markLabel: {
      color: theme.palette.primary.gray2,
    },
  },
});
