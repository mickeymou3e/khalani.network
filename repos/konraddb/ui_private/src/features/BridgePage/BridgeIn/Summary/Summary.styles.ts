import { alpha, SxProps, Theme } from "@mui/material";

export const containerStyle: SxProps<Theme> = {
  flex: 1,
};

export const missingAssetPlaceholderStyle: SxProps<Theme> = (theme: Theme) => ({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: alpha(
    theme.palette.primary.main,
    theme.custom.opacity._3percent
  ),
  borderRadius: "1.5rem",
  padding: "2rem",
  height: "508px",
});
