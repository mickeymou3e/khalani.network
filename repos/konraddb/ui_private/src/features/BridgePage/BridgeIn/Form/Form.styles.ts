import { alpha, styled, SxProps, Theme } from "@mui/material";

export const containerStyle: SxProps<Theme> = {
  background: (theme: Theme) => theme.palette.primary.backgroundGradient,
  borderRadius: "2rem",
  gap: "1.5rem",
  padding: "2rem",
  flex: 1,
};

export const missingAssetPlaceholderStyle: SxProps<Theme> = (theme: Theme) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: alpha(
    theme.palette.primary.main,
    theme.custom.opacity._3percent
  ),
  borderRadius: "1.5rem",
  padding: "2rem",
  height: "240px",
});

export const transferInstructionsStyle: SxProps<Theme> = (theme: Theme) => ({
  backgroundColor: alpha(
    theme.palette.primary.main,
    theme.custom.opacity._3percent
  ),
  padding: "1.5rem",
  borderRadius: "1.5rem",
});

export const UnorderedListStyled = styled("ul")(() => ({
  margin: 0,
  paddingLeft: "1.5rem",
  marginBottom: "0.5rem",
}));
