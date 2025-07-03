import { Theme } from "@mui/material";

export const componentWrapperStyles = (theme: Theme) => ({
  background: theme.palette.primary.backgroundGradient,
  padding: "2rem",
  borderRadius: "2rem",
  display: "flex",
  flexDirection: "column",
  gap: 3,
});
