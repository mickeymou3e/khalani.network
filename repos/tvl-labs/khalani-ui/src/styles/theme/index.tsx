import React from 'react'

import { CssBaseline } from '@mui/material'
import {
  alpha,
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from '@mui/material/styles'
import { createBreakpoints } from '@mui/system'

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    elevation: SimplePaletteColorOptions
  }
  interface PaletteOptions {
    elevation: SimplePaletteColorOptions
  }
}

const white = '#FFFFFF'
const black = '#000000'

const elevation = {
  main: white,
  light: '#F1F1F1',
  dark: '#DBDBDB',
  contrastText: '#36374B',
}

const primary = {
  main: '#F72686',
  light: '#82CAFF',
  dark: '#15436F',
}

const textPrimary = white
const textSecondary = black

const error = '#fb182f'
const warning = '#512adf'
const success = '#35A401'
const info = '#161624'

const breakpoints = createBreakpoints({
  values: {
    xs: 0,
    sm: 320,
    md: 768,
    lg: 1080,
    xl: 1280,
  },
})

export const theme = createTheme({
  shape: {
    borderRadius: 4,
  },
  zIndex: {
    appBar: 1003,
    drawer: 1002,
    modal: 1001,
    tooltip: 1004,
  },
  breakpoints: breakpoints,
  palette: {
    primary,
    elevation,
    secondary: {
      main: '#F4F4F4',
      light: alpha(white, 0.6),
      dark: alpha(white, 0.2),
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
    },
    warning: {
      main: warning,
    },
    error: {
      main: error,
    },
    success: {
      main: success,
    },
    info: {
      main: info,
    },
    common: {
      white: white,
      black: black,
    },
    background: {
      default: '#000000',
    },
  },

  typography: {
    fontFamily: 'Inter',
    h1: {
      fontSize: 61,
      fontWeight: 700,
    },
    h2: {
      fontSize: 49,
      fontWeight: 600,
    },
    h3: {
      fontSize: 39,
      fontWeight: 600,
    },
    h4: {
      fontSize: 31,
      fontWeight: 600,
    },
    h5: {
      fontSize: 25,
      fontWeight: 600,
    },
    h6: {
      fontSize: 20,
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: 18,
      fontWeight: 600,
    },
    subtitle2: {
      fontSize: 16,
      fontWeight: 600,
    },
    body1: {
      fontSize: 16,
      fontWeight: 500,
      lineHeight: '150% !important',
    },
    body2: {
      fontSize: 15,
      fontWeight: 500,
    },
    button: {
      fontSize: 14,
      fontWeight: 500,
      textTransform: 'inherit',
    },
    caption: {
      fontSize: 12,
      fontWeight: 500,
    },
    overline: {
      fontSize: 12,
      fontWeight: 500,
      textTransform: 'inherit',
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          lineHeight: '170%',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          borderRadius: 32,
          background: white,
          boxShadow: `0px 4px 8px -2px ${alpha(
            black,
            0.18,
          )}, 0px 2px 4px -2px ${alpha(black, 0.06)}`,
          padding: 16,
        },
        elevation2: {
          backgroundColor: elevation.main,
        },
        elevation3: {
          backgroundColor: elevation.light,
          borderRadius: 16,
          boxShadow: 'none',
        },
        elevation4: {
          background: 'none',
          border: `1px solid ${alpha(white, 0.1)}`,
          borderRadius: 8,
          padding: '16px 10px',
        },
        elevation5: {
          background: alpha(white, 0.02),
        },
        elevation6: {
          borderRadius: `32px !important`,
          backgroundColor: `${elevation.main} !important`,
          boxShadow: '0px 24px 48px -12px rgba(0, 0, 0, 0.18)',
          padding: `16px !important`,
        },
        elevation7: {
          backgroundColor: elevation.light,
          borderRadius: 32,
          boxShadow: 'none',
        },
        elevation24: {
          backgroundColor: elevation.main,
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter',
          fontWeight: 500,
          fontSize: 16,
          borderRadius: 8,
          textTransform: 'capitalize',
        },
        containedPrimary: {
          border: `1px solid ${primary.main}`,
          background: alpha(primary.main, 0.3),
          '&.Mui-disabled': {
            color: white,
            background: alpha(primary.main, 0.5),
          },
        },
        containedSecondary: {
          background: white,
          color: black,
          borderRadius: 99999,
          '&.Mui-disabled': {
            color: white,
            background: alpha(white, 0.1),
          },
        },
        sizeLarge: {
          height: 46,
        },
        sizeMedium: {
          height: 38,
        },
        sizeSmall: {
          fontSize: 14,
          height: 30,
          minWidth: 43,
          padding: '4px 8px',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: 32,
          color: black,
          WebkitTextFillColor: `${black} !important`,
          '.Mui-disabled': {
            WebkitTextFillColor: `${white} !important`,
          },
          '.MuiInput-input': {
            height: 36,
            padding: 0,
          },
        },
        sizeSmall: {
          fontSize: 12,
          fontWeight: 400,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          backgroundColor: white,
          ':hover': {
            backgroundColor: white,
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          width: '100%',
          borderColor: alpha(black, 0.05),
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
          padding: '0px',
          '&.Mui-selected': {
            background: 'none',
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        root: {
          '.MuiBadge-badge': {
            width: 22,
            height: 22,
            borderRadius: 28,
            backgroundColor: '#FF0000',
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          '&:last-of-type, &:first-of-type': {
            borderRadius: 32,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: elevation.contrastText,
          padding: 10,
          fontSize: 12,
          fontWeight: 500,
        },
        arrow: {
          color: elevation.contrastText,
        },
      },
    },
  },
})

export const ThemeProvider: React.FC = ({ children }) => (
  <MUIThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </MUIThemeProvider>
)
