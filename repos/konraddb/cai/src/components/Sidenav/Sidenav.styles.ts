import { Theme } from "@mui/material";

export const sidenavWrapper = {
  display: "flex",
  flexDirection: "column",
  left: "3rem",
  paddingTop: "4rem",
  gap: 3,
};

export const sidebarButton = (theme: Theme) => ({
  display: "flex",
  justifyContent: "flex-start",
  gap: 2,
  textTransform: "none",
  textAlign: "left",
  height: "58px",
  borderRadius: "3rem",

  [theme.breakpoints.down("tabletLandscape")]: {
    display: "none",
  },
});
