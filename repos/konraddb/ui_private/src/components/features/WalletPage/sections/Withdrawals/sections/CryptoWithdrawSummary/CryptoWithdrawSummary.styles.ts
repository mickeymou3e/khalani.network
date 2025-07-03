import { alpha, Theme } from "@mui/material";

export const withdrawalDetailsSummaryStyles = (theme: Theme) => ({
  padding: "1.5rem",
  background: alpha(theme.palette.primary.main, theme.custom.opacity._3percent),
  borderRadius: "1rem",
  mb: 3,
});

export const addressWrapper = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 1,
  gap: 6,
};

export const addressTextStyles = {
  overflowWrap: "anywhere",
};

export const rowTextStyles = (marginBottom: number) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: marginBottom,
});

export const currencyInlineStyles = {
  display: "flex",
  gap: "0.75rem",
};
