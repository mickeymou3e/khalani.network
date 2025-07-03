import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const switchOverrides = (
  theme: Theme
): Partial<OverridesStyleRules> => ({
  styleOverrides: {
    root: {
      width: "3rem",
      height: "1.5rem",
      padding: 0,
    },

    thumb: {
      boxSizing: "border-box",
      width: "1.4rem",
      height: "1.4rem",
    },

    track: {
      borderRadius: "1.5rem",
      backgroundColor: alpha(
        theme.palette.primary.main,
        theme.custom.opacity._10percent
      ), // Note: Track color when: !disabled and !checked
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },

    switchBase: {
      padding: 0,
      margin: 0,
      transitionDuration: "300ms",
      color: theme.palette.primary.gray2, // Note: Dot color when: !disabled and !checked

      "&.Mui-checked": {
        transform: "translateX(1.5rem)",
        color: theme.palette.primary.main, // Note: Dot color when: !disabled and checked

        "&.Mui-disabled": {
          color: theme.palette.primary.gray3, // Note: Dot color when: disabled and checked
        },

        "& + .MuiSwitch-track": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.custom.opacity._10percent
          ), // Note: Track color when: !disabled and checked
          opacity: 1,
        },

        "&.Mui-disabled + .MuiSwitch-track": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.custom.opacity._5percent
          ), // Note: Track color when: disabled and checked
        },
      },

      "&.Mui-disabled + .MuiSwitch-track": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.custom.opacity._5percent
        ), // Note: Track color when: disabled and !checked
        opacity: 1,
      },

      "&.Mui-disabled": {
        color: theme.palette.primary.gray3, // Note: Dot color when: disabled and !checked
      },
    },
  },
});
