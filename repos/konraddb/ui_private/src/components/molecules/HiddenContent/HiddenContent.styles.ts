import { alpha, Theme } from "@mui/material";

export const hiddenContentStyles = (height: string) => (theme: Theme) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "1rem",
  gap: 3,
  background: alpha(theme.palette.primary.main, theme.custom.opacity._3percent),
  height,
});
