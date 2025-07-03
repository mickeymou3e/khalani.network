import { alpha, Theme } from "@mui/material";

export const emptyGridStyles = (theme: Theme) => ({
  fontSize: "4.5rem",
  color: alpha(theme.palette.primary.main, theme.custom.opacity._20percent),
});
