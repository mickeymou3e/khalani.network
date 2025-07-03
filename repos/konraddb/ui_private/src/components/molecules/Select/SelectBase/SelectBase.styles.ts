import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

import { ThemeModes } from "@/definitions/types";

export const dropdownInputStyle = (renderValue: boolean) => (theme: Theme) => ({
  "& .MuiInputBase-root": {
    sizeMedium: {
      height: "3.75rem",
    },
    sizeSmall: {
      height: "3rem",
    },

    "& .MuiInputBase-input.MuiOutlinedInput-input": {
      cursor: "pointer",
      padding: renderValue ? 0 : "",

      "&::placeholder": {
        color: theme.palette.primary.main,
        fontWeight: 400,
      },
    },
  },

  "& .MuiInputBase-root.Mui-disabled": {
    "& > .MuiInputAdornment-root, & > .MuiInputBase-input": {
      cursor: "default",

      "&::placeholder": {
        color: theme.palette.primary.gray2,
        fontWeight: 400,
      },
    },

    "& > .MuiInputAdornment-positionEnd, & .MuiTypography-root": {
      color: theme.palette.primary.gray3,
    },
  },
});

export const dropdownPaperStyle =
  (minWidth: number, maxHeight: number, hasScrollbar: boolean) =>
  (theme: Theme) => ({
    "& .MuiPaper-root": {
      display: "flex",
      flexDirection: "column",
      minWidth,
      maxHeight: theme.spacing(maxHeight),
      backgroundColor: theme.palette.primary.gray4,
      backgroundImage: "none",
      borderRadius: "1rem",
      overflowY: "hidden",
      boxShadow: `0px 0.25rem 2rem ${theme.palette.custom.shadow}${
        theme.palette.mode === ThemeModes.dark ? "FF" : "2A"
      }`,

      "& .MuiList-root": {
        margin: `0.5rem ${hasScrollbar ? "1rem" : "0"} 0 0`,
        padding: 0,
        overflowY: "auto",
      },

      "& .MuiMenuItem-root": {
        padding: theme.spacing(2, 3),

        "&.Mui-selected": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.custom.opacity._5percent
          ),
        },
      },
    },
  });
