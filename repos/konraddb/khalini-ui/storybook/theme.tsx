import React from 'react'

import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider as MUIThemeProvider,
} from '@mui/material'

import { theme } from '../src/styles/theme'
import IBMPlexMonoBold from './fonts/IBM-plex-mono/IBMPlexMono-Bold.woff2'
import IBMPlexMonoMedium from './fonts/IBM-plex-mono/IBMPlexMono-Medium.woff2'
import IBMPlexMonoSemiBold from './fonts/IBM-plex-mono/IBMPlexMono-SemiBold.woff2'
import SarpanchMedium from './fonts/sarpanch/sarpanch-500.woff2'
import SarpanchBold from './fonts/sarpanch/sarpanch-700.woff2'
import BackgroundDots from './images/background-dots.png'
import Background from './images/background.png'

const createStorybookTheme = () => {
  const newTheme = theme

  if (!newTheme.components) return newTheme

  newTheme.components.MuiCssBaseline = {
    styleOverrides: `
      body {
        height: 100vh;
        width: 100%;
        // background-image: url(${BackgroundDots}), url(${Background});
        background-color: ${newTheme.palette.background.default};
        background-repeat: no-repeat;
        background-size: cover;
       }
       @font-face {
        font-family: 'IBM Plex Mono';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 700;
        src: local('IBM Plex Mono'), url(${IBMPlexMonoBold}) format('woff2');
      }
      @font-face {
        font-family: 'IBM Plex Mono';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 600;
        src: local('IBM Plex Mono'), url(${IBMPlexMonoSemiBold}) format('woff2');
      }
      @font-face {
        font-family: 'IBM Plex Mono';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 500;
        src: local('IBM Plex Mono'), url(${IBMPlexMonoMedium}) format('woff2');
      }
      @font-face {
        font-family: 'Sarpanch';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 700;
        src: local('Sarpanch'), url(${SarpanchBold}) format('woff2');
      }
      @font-face {
        font-family: 'Sarpanch';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 500;
        src: local('Sarpanch'), url(${SarpanchMedium}) format('woff2');
      }
    `,
  }

  return newTheme
}

export const ThemeProvider: React.FC = ({ children }) => (
  <StyledEngineProvider injectFirst>
    <MUIThemeProvider theme={createStorybookTheme()}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  </StyledEngineProvider>
)
