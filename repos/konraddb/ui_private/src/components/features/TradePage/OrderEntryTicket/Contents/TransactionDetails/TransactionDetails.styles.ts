import { alpha, Theme } from "@mui/material";

export const topContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

export const containerStyle = (theme: Theme) => ({
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
  padding: "1.5rem",
  borderRadius: "1rem",
  backgroundColor: alpha(
    theme.palette.primary.main,
    theme.custom.opacity._3percent
  ),
});

export const contentStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
};

export const innerContentStyle = (theme: Theme) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 1.5,

  "& .MuiSvgIcon-root": {
    fontSize: "1.25rem",
    color: theme.palette.primary.gray2,
  },
});

export const notificationStyle = {
  marginTop: 1,
};
