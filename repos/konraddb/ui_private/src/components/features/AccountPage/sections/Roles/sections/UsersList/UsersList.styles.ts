import { Theme } from "@mui/material";

export const containerStyle = (theme: Theme) => ({
  background: theme.palette.primary.backgroundGradient,
  borderRadius: 4,
  padding: 4,
  overflow: "hidden",
  display: "grid",
  gridTemplateColumns: "1fr 3fr 3fr minmax(0,3fr) 1.5fr 1fr",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1.5rem",
  mb: "1.5rem",
});
