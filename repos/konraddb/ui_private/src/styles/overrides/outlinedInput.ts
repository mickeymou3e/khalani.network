import { alpha, Theme } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const outlinedInputOverrides = (
  theme: Theme
): Partial<OverridesStyleRules> => ({
  defaultProps: {
    notched: false,
  },
  styleOverrides: {
    root: {
      "&:hover": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: alpha(
            theme.palette.primary.main,
            theme.custom.opacity._60percent
          ),
        },
      },
      "&.Mui-error": {
        color: theme.palette.error.main,
        backgroundColor: alpha(
          theme.palette.alert.red,
          theme.custom.opacity._10percent
        ),
        "&:hover": {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.error.main,
          },
        },
      },
      "&.Mui-focused": {
        color: theme.palette.primary.main,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.light,
        },
      },
      "&.Mui-disabled": {
        background: alpha(
          theme.palette.primary.main,
          theme.custom.opacity._15percent
        ),
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: alpha(
            theme.palette.primary.main,
            theme.custom.opacity._15percent
          ),
        },
      },
      "& .MuiSelect-icon": {
        right: theme.spacing(3),
        transform: "none",
        [theme.breakpoints.down("mobilePortrait")]: {
          right: theme.spacing(2),
        },
      },
      "&.MuiInputBase-adornedStart": {
        paddingLeft: theme.spacing(3),
        [theme.breakpoints.down("mobilePortrait")]: {
          paddingLeft: theme.spacing(2),
        },
      },
      "& .MuiSelect-select": {
        "&.MuiOutlinedInput-input.MuiInputBase-input": {
          paddingRight: theme.spacing(6),
        },
        "& .MuiBox-root": {
          overflow: "hidden",
        },
      },
      "&:not(.MuiInputBase-multiline)": {
        height: "4rem",
      },
      "&.MuiInputBase-multiline": {
        "& textarea": {
          padding: "0 !important",
        },
      },
      "&.MuiInputBase-sizeSmall:not(.MuiInputBase-multiline)": {
        height: "3rem",
      },
    },
    input: {
      fontSize: 18,
      lineHeight: 1.55,
      height: "auto",
      padding: theme.spacing(2.25, 3),
      [theme.breakpoints.down("mobilePortrait")]: {
        fontSize: 16,
        padding: theme.spacing(1.875, 2),
      },
    },
    notchedOutline: {
      borderColor: `${alpha(
        theme.palette.primary.main,
        theme.custom.opacity._60percent
      )}`,
    },
  },
});
