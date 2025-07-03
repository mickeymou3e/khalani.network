import { alpha, Theme } from "@mui/material";

export const grayTextWrapperStyles = (theme: Theme) => ({
  background: alpha(theme.palette.primary.main, theme.custom.opacity._3percent),
  borderRadius: 3,
  padding: 3,
});
