import { alpha, SxProps, Theme } from "@mui/material";

export const containerStyle: SxProps<Theme> = (theme: Theme) => ({
  backgroundColor: alpha(
    theme.palette.primary.main,
    theme.custom.opacity._3percent
  ),
  borderRadius: "1rem",
  listStyle: "none",
  padding: "1.5rem",
  gap: "0.5rem",
  margin: 0,
});

export const emptyContainerStyle: SxProps<Theme> = (theme: Theme) => ({
  ...containerStyle(theme),
  padding: "3rem 1.5rem",
  justifyContent: "center",
  alignItems: "center",
});

export const placeholderIconStyle: SxProps<Theme> = (theme: Theme) => ({
  color: alpha(theme.palette.primary.main, theme.custom.opacity._20percent),
  fontSize: "4.5rem",
});
