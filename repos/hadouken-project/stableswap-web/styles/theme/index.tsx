import React from 'react'

import background from '@assets/background.png'
import { theme } from '@hadouken-project/ui'
import { CssBaseline } from '@mui/material'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

const generateTheme = () => {
  const newTheme = theme

  if (!newTheme.components) return newTheme

  newTheme.components.MuiCssBaseline = {
    styleOverrides: `
      body {
        height: 100vh;
        width: 100%;
        background-image: url(${background.src});
        background-color: ${newTheme.palette.background.default};
        background-repeat: no-repeat;
        background-size: cover;
       }
       @font-face {
        font-family: 'IBM Plex Mono';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 700;
        src: local('IBM Plex Mono'), url(../fonts/IBM-plex-mono/IBMPlexMono-Bold.woff2) format('woff2');
      }
      @font-face {
        font-family: 'IBM Plex Mono';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 600;
        src: local('IBM Plex Mono'), url(../fonts/IBM-plex-mono/IBMPlexMono-SemiBold.woff2) format('woff2');
      }
      @font-face {
        font-family: 'IBM Plex Mono';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 500;
        src: local('IBM Plex Mono'), url(../fonts/IBM-plex-mono/IBMPlexMono-Medium.woff2) format('woff2');
      }
      @font-face {
        font-family: 'Sarpanch';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 700;
        src: local('Sarpanch'), url(../fonts/sarpanch/sarpanch-700.woff2) format('woff2');
      }
      @font-face {
        font-family: 'Sarpanch';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 500;
        src: local('Sarpanch'), url(../fonts/sarpanch/sarpanch-500.woff2) format('woff2');
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
