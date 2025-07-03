import { alpha, SxProps, Theme } from "@mui/material";

const headingColor = "#EAEAEA";

export const detailsContainerStyle: SxProps<Theme> = (theme: Theme) => ({
  gap: 4,
  justifyContent: "space-between",
  backgroundColor: headingColor,
  borderRadius: 6,
  padding: theme.spacing(3),
  width: "70.5rem",

  "& .MuiTableCell-head": {
    backgroundColor: headingColor,
  },

  "& .MuiTableCell-body:first-of-type .MuiTypography-root": {
    textWrap: "wrap",
  },

  "& .MuiTableRow-root > td.MuiTableCell-root.MuiTableCell-body:last-of-type": {
    paddingRight: "0.5rem",
  },
});

export const chartContainerStyle: SxProps<Theme> = {
  gap: 2,
  px: 4,
  paddingBottom: 3,
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

export const searchInputStyle: SxProps<Theme> = {
  width: "100%",
};

export const placeholderWrapper = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};
