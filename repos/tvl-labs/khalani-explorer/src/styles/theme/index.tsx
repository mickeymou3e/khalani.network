import React from 'react'

import { CssBaseline } from '@mui/material'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import { theme } from '@tvl-labs/khalani-ui'

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
        height: 100vh;
        width: 100%;
        background-color: #1E2032;
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

export const ThemeProvider: React.FC = ({ children }) => (
  <MUIThemeProvider theme={generateTheme()}>
    <CssBaseline />
    {children}
  </MUIThemeProvider>
)
