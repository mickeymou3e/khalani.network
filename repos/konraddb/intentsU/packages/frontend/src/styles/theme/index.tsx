import React from "react";

import { CssBaseline } from "@mui/material";
import {
  alpha,
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";

import CourierStdMedium from "../fonts/courier/CourierStdMedium.otf";
import CourierStdBold from "../fonts/courier/CourierStdBold.otf";
import RobotoLight from "../fonts/Roboto-Light.ttf";
import AgencyFB from "../fonts/agency_fb.ttf";
import { useScreenSize } from "./theme.hooks";
import { typographySettings } from "./typography";

const palette = {
  primary: {
    main: "#1e1c3c",
  },
  secondary: { main: "#90bf9e" },
  text: {
    primary: "#ffffff",
    secondary: "#000000",
  },
  elevation: {
    main: "#ffffff",
  },
};

const generateTheme = (currentScreenSize: string) => {
  const theme = createTheme({
    palette,
    typography: typographySettings[currentScreenSize],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: "Roboto",
            fontWeight: 300,
            textTransform: "lowercase",
            boxShadow: "none",
            background: alpha("#ffffff", 0.3),
            borderRadius: 12,
            color: "#000000",
          },
        },
      },
    },
  });

  if (!theme.components) return theme;

  theme.components.MuiCssBaseline = {
    styleOverrides: `
      body, html, #root {
        height: 100%;
        width: 100%;
       }
      @font-face {
        font-family: 'Courier';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 500;
        src: local('Courier Std Medium'), url(${CourierStdMedium}) format('truetype');
      }
      @font-face {
        font-family: 'Courier';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 700;
        src: local('Courier Std Bold'), url(${CourierStdBold}) format('truetype');
      }
      @font-face {
        font-family: 'Roboto';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 300;
        src: local('Roboto'), url(${RobotoLight}) format('truetype');
      }
      @font-face {
        font-family: 'Agency FB';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 300;
        src: local('Agency FB'), url(${AgencyFB}) format('truetype');
      }
    `,
  };

  return theme;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const currentScreenSize = useScreenSize();

  return (
    <MUIThemeProvider theme={generateTheme(currentScreenSize)}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};
