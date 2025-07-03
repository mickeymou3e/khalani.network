import { Theme } from "@mui/material";

export const layoutContainerStyle = (isBackdropOpen: boolean) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minHeight: "100vh",
  width: "100%",
  position: isBackdropOpen ? "fixed" : "",
  top: isBackdropOpen ? 0 : "",
});

export const contentStyle = (theme: Theme) => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  gap: 6,
  padding: "2rem 3rem",
  width: "100%",

  [theme.breakpoints.up("fullHd")]: {
    maxWidth: "114rem",
    padding: "2rem 0",
  },
});

export const toastContainerStyle = {
  padding: 0,
  margin: 0,
  top: "5rem",
  right: 0,
  minWidth: 440,
};

export const toastStyle = {
  margin: 0,
  padding: 0,
  boxShadow: "none",
  borderRadius: 0,
  marginBottom: "0.5rem",
};

export const toastBodyStyle = {
  padding: 0,
  margin: 0,
};
