import { Theme } from "@mui/material";

export const containerStyle = (theme: Theme) => ({
  display: "flex",
  flexDirection: "column",
  background: theme.palette.primary.backgroundGradient,
  borderRadius: 4,
  padding: 4,
  gap: 3,
  height: "100%",
});
