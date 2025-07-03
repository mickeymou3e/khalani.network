import { SxProps, Theme } from "@mui/material";

export const formContainerStyles: SxProps<Theme> = {
  background: (theme: Theme) => theme.palette.primary.backgroundGradient,
  borderRadius: "2rem",
  gap: "1.5rem",
  padding: "2rem",
  flex: 1,
};
