import { Theme } from "@mui/material";

export const typographyOptions = (_: Theme, fontFamily: string) => ({
  fontFamily,
  htmlFontSize: 16,
  h1: {
    fontFamily,
    fontSize: "6rem",
    fontWeight: "800",
    lineHeight: "110%",
  },
  h2: {
    fontFamily,
    fontSize: "5rem",
    fontWeight: "700",
    lineHeight: "120%",
  },
  h3: {
    fontFamily,
    fontSize: "4rem",
    fontWeight: "700",
    lineHeight: "140%",
  },
  h4: {
    fontFamily,
    fontSize: "3rem",
    fontWeight: "700",
    lineHeight: "150%",
  },
  h5: {
    fontFamily,
    fontSize: "2rem",
    fontWeight: "600",
    lineHeight: "150%",
  },
  h6: {
    fontFamily,
    fontSize: "1.5rem",
    fontWeight: "500",
    lineHeight: "160%",
  },
  subtitle: {
    fontFamily,
    fontSize: "1.125rem",
    fontWeight: "400",
    lineHeight: "165%",
  },
  body1: {
    fontFamily,
    fontSize: "1rem",
    fontWeight: "normal",
    lineHeight: "160%",
  },
  body2: {
    fontFamily,
    fontSize: "0.875rem",
    fontWeight: "normal",
    lineHeight: "170%",
  },
  body3: {
    fontFamily,
    fontSize: "0.75rem",
    fontWeight: "normal",
    lineHeight: "180%",
  },
  buttonLarge: {
    fontFamily,
    fontSize: "1rem",
    fontWeight: "500",
    width: "max-content",
    lineHeight: "150%",
    "&.MuiTypography-buttonLarge": {
      textTransform: "uppercase",
    },
  },
  buttonMedium: {
    fontFamily,
    fontSize: "0.875rem",
    fontWeight: "500",
    lineHeight: "140%",
    width: "max-content",
    "&.MuiTypography-buttonMedium": {
      textTransform: "uppercase",
    },
  },
  buttonSmall: {
    fontFamily,
    fontSize: "0.75rem",
    fontWeight: "500",
    lineHeight: "130%",
    width: "max-content",
    "&.MuiTypography-buttonSmall": {
      textTransform: "uppercase",
    },
  },
  caption: {
    fontFamily,
    fontSize: "0.625rem",
    fontWeight: "500",
    lineHeight: "180%",
  },
  inputLabel: {
    fontFamily,
    fontSize: "0.875rem",
    fontWeight: "normal",
    lineHeight: "170%",
  },
  helperText: {
    fontFamily,
    fontSize: "0.875rem",
    fontWeight: "normal",
    lineHeight: "170%",
  },
  inputText: {
    fontFamily,
    fontSize: "1rem",
    fontWeight: "normal",
    lineHeight: "160%",
  },
});
