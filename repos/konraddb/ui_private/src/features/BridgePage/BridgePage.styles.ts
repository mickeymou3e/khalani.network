import { SxProps, Theme } from "@mui/material/styles";

export const rootStyles: SxProps<Theme> = (theme: Theme) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  mt: "3rem",
  gap: "4rem",

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
