import { alpha, Theme } from "@mui/material";

export const iconStyles =
  (size = "4.5rem") =>
  (theme: Theme) => ({
    fontSize: size,
    color: alpha(theme.palette.primary.main, theme.custom.opacity._20percent),
  });
