import { alpha, Theme } from "@mui/material";

export const legendContainerStyle = (dimensions: number) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "primary.gray4",
  borderRadius: 6,
  padding: 3,
  width: dimensions,
  height: "auto",
});

export const emptyLegendContainerStyle =
  (dimensions: number) => (theme: Theme) => ({
    ...legendContainerStyle(dimensions),
    justifyContent: "center",
    alignItems: "center",
    gap: 2,

    "& .MuiTypography-root": {
      color: "primary.gray2",
    },

    "& .MuiSvgIcon-root": {
      color: alpha(theme.palette.primary.main, theme.custom.opacity._20percent),
      width: "3.5rem",
      height: "3.5rem",
    },
  });

export const legendEntryStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: 1,
  cursor: "pointer",
  pb: 1,

  "&:last-of-type": {
    pb: 0,
  },
};

export const leftContentStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 1,
};

export const rightContentStyle = {
  display: "flex",
  flexDirection: "row",
  gap: 2,
};

export const indicatorStyle = (backgroundColor: string) => ({
  width: "0.5rem",
  height: "0.5rem",
  borderRadius: 1.5,
  backgroundColor,
});

export const textStyle = (selected: boolean) => (theme: Theme) => ({
  textTransform: "capitalize",
  color: selected
    ? theme.palette.primary.main
    : alpha(theme.palette.primary.main, theme.custom.opacity._20percent),
});
