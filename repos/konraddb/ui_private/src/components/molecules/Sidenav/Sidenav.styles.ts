import { Theme } from "@mui/material";

export const sidenavWrapper = {
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  left: "3rem",
  paddingTop: "6rem",
  gap: 3,
};

export const sidebarButton = (theme: Theme) => ({
  display: "flex",
  justifyContent: "flex-start",
  gap: 2,
  minWidth: "14rem",
  maxWidth: "14rem",
  textTransform: "none",
  textAlign: "left",
  height: "58px",
  borderRadius: "3rem",

  [theme.breakpoints.down("extendedDesktop")]: {
    minWidth: "4rem",
    maxWidth: "4rem",
    justifyContent: "center",
  },

  [theme.breakpoints.down("tabletLandscape")]: {
    display: "none",
  },
});
