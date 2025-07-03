import { alpha, Theme } from "@mui/material";

export const mainWrapperStyles = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: 6,
  mx: "auto",
  mt: 6,
};

export const formWrapper = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: 3,
};

export const textWrapperStyles = (theme: Theme) => ({
  background: alpha(
    theme.palette.primary.gray1,
    theme.custom.opacity._3percent
  ),
  borderRadius: "1rem",
  padding: 3,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});
