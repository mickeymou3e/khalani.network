import React from 'react'

import { IChildren } from '@interfaces/children'
import { CssBaseline } from '@mui/material'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import { theme } from '@tvl-labs/khalani-ui'

import background from '../background.png'
import InterBold from '../fonts/inter/Inter-Bold.ttf'
import InterLight from '../fonts/inter/Inter-Light.ttf'
import InterMedium from '../fonts/inter/Inter-Medium.ttf'
import InterRegular from '../fonts/inter/Inter-Regular.ttf'
import InterSemiBold from '../fonts/inter/Inter-SemiBold.ttf'

const generateTheme = () => {
  const newTheme = theme

  if (!newTheme.components) return newTheme

  newTheme.components.MuiCssBaseline = {
    styleOverrides: `
      body {
        min-height: 100vh;
        width: 100%;
        background: url(${background});
        background-repeat: no-repeat;
        background-size: cover;
       }
       @font-face {
        font-family: 'Inter';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 400;
        src: local('Inter'), url(${InterLight}) format('truetype');
      }
       @font-face {
        font-family: 'Inter';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 400;
        src: local('Inter'), url(${InterRegular}) format('truetype');
      }
      @font-face {
        font-family: 'Inter';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 500;
        src: local('Inter'), url(${InterMedium}) format('truetype');
      }
      @font-face {
        font-family: 'Inter';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 600;
        src: local('Inter'), url(${InterSemiBold}) format('truetype');
      }
      @font-face {
        font-family: 'Inter';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 700;
        src: local('Inter'), url(${InterBold}) format('truetype');
      }
    `,
  }

  return newTheme
}

export const ThemeProvider: React.FC<IChildren> = ({ children }) => (
  <MUIThemeProvider theme={generateTheme()}>
    <CssBaseline />
    {children}
  </MUIThemeProvider>
)
