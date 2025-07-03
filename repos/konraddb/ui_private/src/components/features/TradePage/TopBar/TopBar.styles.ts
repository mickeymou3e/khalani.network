import { Theme } from "@mui/material";

export const containerStyle = (theme: Theme) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1.5rem 2rem",
  background: theme.palette.primary.backgroundGradient,
  borderRadius: "2rem",

  "& .MuiInputBase-root": {
    maxWidth: "20rem",
  },
});

export const leftPartStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "left",
  gap: "1.5rem",
};
