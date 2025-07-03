import { alpha, Theme } from "@mui/material";

export const componentWrapperStyles = (theme: Theme) => ({
  background: theme.palette.primary.backgroundGradient,
  padding: "2rem",
  borderRadius: "2rem",
  display: "flex",
  flexDirection: "column",
  gap: 3,
});

export const smallSummaryBoxStyles = (theme: Theme) => ({
  padding: "1.5rem",
  background: alpha(theme.palette.primary.main, theme.custom.opacity._3percent),
  borderRadius: "1rem",
  mt: -2,
});

export const qrCodeWrapper = (theme: Theme) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 4,
  width: "100%",
  backgroundColor: alpha(
    theme.palette.primary.main,
    theme.custom.opacity._3percent
  ),
  borderRadius: 4,
});

export const innerQrCodeWrapper = (theme: Theme) => ({
  padding: 1,
  paddingBottom: 0,
  backgroundColor: theme.palette.common.white,
  borderRadius: 2,
});
