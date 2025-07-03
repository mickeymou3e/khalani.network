import { alpha, Theme } from "@mui/material";

export const withdrawalDetailsSummaryStyles = (theme: Theme) => ({
  padding: "1.5rem",
  background: alpha(theme.palette.primary.main, theme.custom.opacity._3percent),
  borderRadius: "1rem",
  mb: 3,
});

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

export const notificationStyles = {
  lineHeight: "1.5rem",
};

export const underlineTextStyles = {
  textDecoration: "underline",
  cursor: "pointer",
  marginLeft: "0.125rem",
};
