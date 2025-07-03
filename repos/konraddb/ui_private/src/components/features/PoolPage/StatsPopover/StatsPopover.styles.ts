import { alpha, SxProps, Theme } from "@mui/material";

export const detailsContainerStyle: SxProps<Theme> = {
  gap: 2,
};

export const chartContainerStyle: SxProps<Theme> = {
  gap: 4,
  justifyContent: "space-between",
  alignItems: "center",
};

export const innerChartContainerStyle: SxProps<Theme> = {
  gap: 3,
  alignItems: "center",
};

export const legendStyle: SxProps<Theme> = (theme: Theme) => ({
  "&.MuiBox-root": {
    backgroundColor: alpha(
      theme.palette.primary.main,
      theme.custom.opacity._3percent
    ),
  },
});
