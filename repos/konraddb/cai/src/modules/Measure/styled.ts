import { Box, Theme, Stack, styled } from "@mui/material";

export const subpageContainerStyles = (theme: Theme) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  padding: "4rem 3rem 3rem 3rem",

  [theme.breakpoints.up("fullHd")]: {
    width: "1280px",
  },

  [theme.breakpoints.up("smallDesktop")]: {
    width: "1136px",
  },

  [theme.breakpoints.up("tabletLandscape")]: {
    width: "1024px",
  },

  [theme.breakpoints.down("tabletLandscape")]: {
    padding: "4rem 0rem",
    width: "100%",
  },
});

export const accountPageStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

export const ContentWrapper = styled(Stack)({
  width: "100%",
  padding: "2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

export const EmissionsContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  gap: "20px",
});

export const EmissionsBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginRight: "20px",
  paddingLeft: "3rem",
});

export const PlaceholderCircleContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "220px",
  height: "220px",
  borderRadius: "50%",
});

export const ChartSectionContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "5rem",
  margin: "0 10px 0 0",
});

export const PieChartContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "220px",
  height: "220px",
  borderRadius: "50%",
  margin: "0 0px 0 70px",
});

export const LegendContainer = styled(Box)({
  backgroundColor: "#F5F5F5",
  borderRadius: "8px",
  padding: "10px",
  width: "280px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
});

export const ChartPlaceholder = styled(Box)({
  width: "100%",
  height: "200px",
  backgroundColor: "#F5F5F5",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#B0B0B0",
  marginTop: "1rem",
});

export const legendPlaceholderStyles = (theme: Theme) => ({
  background: theme.palette.primary.backgroundGradient,
  borderRadius: "24px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  padding: "4rem",
  maxWidth: 350,
  gap: 3,
});
