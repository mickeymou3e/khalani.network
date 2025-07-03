import React from 'react'

import { CssBaseline } from '@mui/material'
import {
  alpha,
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from '@mui/material/styles'

import CourierNew from '../fonts/courier/cour.ttf'
import CourierNewBold from '../fonts/courier/courbd.ttf'
import RobotoLight from '../fonts/Roboto-Light.ttf'
import AgencyFB from '../fonts/agency_fb.ttf'
import { IChildren } from '@tvl-labs/khalani-ui/dist/interfaces/children'
import { useScreenSize } from './theme.hooks'
import { typographySettings } from './typography'
import { ScreenSize } from './theme.types'

const palette = {
  primary: {
    main: '#1f2448',
  },
  secondary: { main: '#98bc9c' },
  text: {
    primary: '#ffffff',
    secondary: '#000000',
  },
  elevation: {
    main: '#ffffff',
  },
}

const palleteMobile = {
  ...palette,

  primary: {
    main: '#1D1F3E',
  },
}

const generateTheme = (currentScreenSize: string) => {
  const theme = createTheme({
    palette: currentScreenSize === ScreenSize.MOBILE ? palleteMobile : palette,
    typography: typographySettings[currentScreenSize],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: 'Roboto',
            fontWeight:
              typographySettings[currentScreenSize].button.fontWeight || 300,
            fontSize: typographySettings[currentScreenSize].button.fontSize,
            textTransform: 'capitalize',
            boxShadow: 'none',
            background: alpha('#ffffff', 0.3),
            borderRadius: 12,
            color: '#000000',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          elevation: {
            background: alpha('#ffffff', 0.3),
            borderRadius: 12,
            padding: 8,
          },
        },
      },
    },
  })

  if (!theme.components) return theme

  theme.components.MuiCssBaseline = {
    styleOverrides: `
      body, html, #root {
        height: 100%;
        width: 100%;
        background: #333;
        margin: 0;
       }
      @font-face {
        font-family: 'Courier';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 300;
        src: local('Courier Std Medium'), url(${CourierNew}) format('truetype');
      }
      @font-face {
        font-family: 'Courier';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 500;
        src: local('Courier Std Bold'), url(${CourierNewBold}) format('truetype');
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
  }

  return theme
}

export const ThemeProvider: React.FC<IChildren> = ({ children }) => {
  const currentScreenSize = useScreenSize()

  return (
    <MUIThemeProvider theme={generateTheme(currentScreenSize)}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  )
}
