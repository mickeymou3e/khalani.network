import { alpha, Theme } from "@mui/material";

export const mainWrapperStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  mx: "auto",
  mt: 6,
};

export const formWrapper = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  mt: 6,
};

export const textWrapperStyles = (theme: Theme) => ({
  background: alpha(
    theme.palette.primary.gray1,
    theme.custom.opacity._3percent
  ),
  borderRadius: 2,
  padding: 3,
  mt: 2,
});
