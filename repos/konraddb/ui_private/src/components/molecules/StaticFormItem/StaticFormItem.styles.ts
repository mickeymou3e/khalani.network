import { alpha, SxProps, Theme } from "@mui/material";

export const contentContainerStyle: SxProps<Theme> = (theme: Theme) => ({
  backgroundColor: alpha(
    theme.palette.primary.main,
    theme.custom.opacity._3percent
  ),
  fontSize: "1rem",
  padding: "1rem",
  borderRadius: "1rem",
});

export const textContentStyle: SxProps<Theme> = {
  minHeight: "2rem",
};

export const customContentStyle: SxProps<Theme> = {
  minHeight: "2rem",
  justifyContent: "center",
};
