import { Theme } from "@mui/material";

export const accountPageStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

export const subpageContainerStyles = (theme: Theme) => ({
  display: "flex",
  flexDirection: "column",
  gap: 9,
  width: "100%",
  padding: "6rem 3rem",

  [theme.breakpoints.up("fullHd")]: {
    width: "1280px",
  },

  [theme.breakpoints.up("smallDesktop")]: {
    width: "1136px",
  },

  [theme.breakpoints.up("tabletLandscape")]: {
    width: "1024px",
  },

  [theme.breakpoints.down("tabletLandscape")]: {
    padding: "6rem 0rem",
    width: "100%",
  },
});
