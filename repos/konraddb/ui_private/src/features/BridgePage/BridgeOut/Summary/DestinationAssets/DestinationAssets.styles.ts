import { alpha, SxProps, Theme } from "@mui/material";

export const sectionStyle: SxProps<Theme> = (theme: Theme) => ({
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
