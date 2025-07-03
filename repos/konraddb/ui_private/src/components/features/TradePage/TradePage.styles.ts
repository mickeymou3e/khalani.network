import { Theme } from "@mui/material";

export const containerStyle = (theme: Theme) => ({
  display: "flex",
  flexDirection: "column-reverse",
  gap: 8,

  [theme.breakpoints.up("smallDesktop")]: {
    flexDirection: "row",
    flex: 1,
    gap: 3,
  },
});
