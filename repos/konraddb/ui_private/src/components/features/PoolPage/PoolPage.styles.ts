import { SxProps, Theme } from "@mui/material/styles";

export const rootStyles: SxProps<Theme> = (theme: Theme) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  mt: "3rem",

  [theme.breakpoints.up("largeDesktop")]: {
    maxWidth: "1184px",
  },

  [theme.breakpoints.down("largeDesktop")]: {
    maxWidth: "1040px",
  },

  [theme.breakpoints.down("tabletPortrait")]: {
    maxWidth: "100%",
  },
});

export const actionAreaContainerStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  gap: "3rem",
};

export const formContainerStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
  flex: 1,
};
