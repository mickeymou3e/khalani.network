import { Theme } from "@mui/material";

export const containerStyle = (theme: Theme) => ({
  display: "flex",
  flexDirection: "column",
  width: "520px",
  gap: 3,
  mx: "auto",

  [theme.breakpoints.up("smallDesktop")]: {
    mx: 0,
  },
});
