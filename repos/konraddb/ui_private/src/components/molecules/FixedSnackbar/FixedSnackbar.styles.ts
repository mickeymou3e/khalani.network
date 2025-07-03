import { alpha, Theme } from "@mui/material";

export const snackbarStyle = (error: boolean) => (theme: Theme) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderRadius: 4,
  minWidth: 440,
  padding: "0.75rem 1.5rem",
  backgroundColor: error
    ? alpha(theme.palette.alert.red, theme.custom.opacity._10percent)
    : theme.palette.primary.gray4,
});

export const leftContentStyle = (theme: Theme) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "left",
  gap: "1rem",

  "& .MuiSvgIcon-root": {
    color: theme.palette.primary.main,
  },
});

export const iconStyle = (error: boolean) => (theme: Theme) => ({
  "&.MuiSvgIcon-root": {
    color: error ? theme.palette.alert.red : theme.palette.primary.main,
  },
});
