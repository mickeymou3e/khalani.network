import { PaletteOptions } from "@mui/material";

const commonColors = {
  common: {
    black: "#0A080D",
    white: "#FFFFFF",
  },
};

export const paletteOptions = {
  dark: {
    primary: {
      accent: "#00D1A0",
      main: "#FFFFFF",
      gray1: "#8F8CA1",
      gray2: "#8F8CA1",
      gray3: "#6A677E",
      gray4: "#27222F",
      buttonText: "#16131C",
      background: "#1F1C27",
      gridHeader: "#26232E",
      backgroundGradient:
        "linear-gradient(180deg, #26232E 20%, #FFFFFF00 100%)",
    },
    alert: {
      blue: "#1A90FF",
      green: "#00D1A0",
      red: "#FF4769",
      orange: "#E06C00",
    },
    custom: {
      shadow: "#16131C",
    },
    ...commonColors,
  } as PaletteOptions,
  light: {
    primary: {
      accent: "#007A6C",
      main: "#16131C",
      gray1: "#6A677E",
      gray2: "#6A677E",
      gray3: "#8F8CA1",
      gray4: "#EDEDEE",
      buttonText: "#FFFFFF",
      background: "#F6F6F6",
      gridHeader: "#EFEFEF",
      backgroundGradient:
        "linear-gradient(180deg, #16131c08 0%, #16131c03 100%)",
    },
    alert: {
      blue: "#0067C7",
      green: "#007A6C",
      red: "#D10049",
      orange: "#A85100",
    },
    custom: {
      shadow: "#16131C4D",
    },
    ...commonColors,
  } as PaletteOptions,
};
