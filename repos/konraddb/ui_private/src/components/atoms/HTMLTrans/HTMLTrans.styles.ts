import { SxProps, Theme } from "@mui/material";

export const containerStyle: SxProps<Theme> = {
  "& ol, & ul": {
    fontSize: "0.875rem",
  },

  "& ol": {
    padding: 0,
    margin: 0,
    listStylePosition: "inside",

    "& > li": {
      padding: "0.25rem 0",
    },
  },

  "& ul": {
    listStylePosition: "outside",
    listStyleType: "disc",
  },
};
