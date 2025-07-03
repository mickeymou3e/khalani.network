import { Theme } from "@mui/material";

export const neutralBackdropStyle = (theme: Theme) => ({
  background: theme.palette.background.default,
  color: theme.palette.primary.main,
  zIndex: 3,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
});

export const buttonStyle = () => ({
  position: "absolute",
  top: 0,
  right: 0,
  margin: "4.5rem",
  padding: "1rem",
});
