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
import InterBold from './fonts/inter/Inter-Bold.woff2'
import InterLight from './fonts/inter/Inter-Light.woff2'
import InterMedium from './fonts/inter/Inter-Medium.woff2'
import InterRegular from './fonts/inter/Inter-Regular.woff2'
import InterSemiBold from './fonts/inter/Inter-SemiBold.woff2'
import MontserratBold from './fonts/montserrat/Montserrat-Bold.woff2'
import MontserratMedium from './fonts/montserrat/Montserrat-Medium.woff2'
import MontserratRegular from './fonts/montserrat/Montserrat-Regular.woff2'
import MontserratSemiBold from './fonts/montserrat/Montserrat-SemiBold.woff2'
import ParsiBold from './fonts/parsi/Parsi-Bold.woff2'
import ParsiLight from './fonts/parsi/Parsi-Light.woff2'
import ParsiRegular from './fonts/parsi/Parsi-Regular.woff2'
import SarpanchMedium from './fonts/sarpanch/sarpanch-500.woff2'
import SarpanchBold from './fonts/sarpanch/sarpanch-700.woff2'
import ZenDots from './fonts/zen-dots/ZenDots-Regular.woff2'

const createStorybookTheme = () => {
  const newTheme = theme

  if (!newTheme.components) return newTheme

  newTheme.components.MuiCssBaseline = {
    styleOverrides: `
      body {
        height: 100vh;
        width: 100%;
        background-color: ${newTheme.palette.elevation.dark};
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
      @font-face {
        font-family: 'Zen Dots';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 400;
        src: local('Zen Dots'), url(${ZenDots}) format('woff2');
      }
      @font-face {
        font-family: 'Parsi';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 400;
        src: local('Zen Dots'), url(${ParsiLight}) format('woff2');
      }
      @font-face {
        font-family: 'Parsi';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 500;
        src: local('Zen Dots'), url(${ParsiRegular}) format('woff2');
      }
      @font-face {
        font-family: 'Parsi';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 700;
        src: local('Zen Dots'), url(${ParsiBold}) format('woff2');
      }
      @font-face {
        font-family: 'Montserrat';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 400;
        src: local('Montserrat'), url(${MontserratRegular}) format('woff2');
      }
      @font-face {
        font-family: 'Montserrat';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 500;
        src: local('Montserrat'), url(${MontserratMedium}) format('woff2');
      }
      @font-face {
        font-family: 'Montserrat';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 600;
        src: local('Montserrat'), url(${MontserratSemiBold}) format('woff2');
      }
      @font-face {
        font-family: 'Montserrat';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 700;
        src: local('Montserrat'), url(${MontserratBold}) format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 300;
        src: local('Inter'), url(${InterLight}) format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 400;
        src: local('Inter'), url(${InterRegular}) format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 500;
        src: local('Inter'), url(${InterMedium}) format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 600;
        src: local('Inter'), url(${InterSemiBold}) format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 700;
        src: local('Inter'), url(${InterBold}) format('woff2');
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
