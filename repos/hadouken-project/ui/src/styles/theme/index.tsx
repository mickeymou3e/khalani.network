import React, { PropsWithChildren } from 'react'

import { CssBaseline } from '@mui/material'
import {
  alpha,
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from '@mui/material/styles'
import { createBreakpoints } from '@mui/system'

declare module '@mui/material/styles' {
  interface TypographyVariants {
    paragraphBig: React.CSSProperties
    paragraphMedium: React.CSSProperties
    paragraphSmall: React.CSSProperties
    paragraphTiny: React.CSSProperties
    buttonBig: React.CSSProperties
    buttonMedium: React.CSSProperties
    buttonSmall: React.CSSProperties
    breadCrumbs: React.CSSProperties
    h4Bold: React.CSSProperties
    h4Regular: React.CSSProperties
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    paragraphBig?: React.CSSProperties
    paragraphMedium?: React.CSSProperties
    paragraphSmall?: React.CSSProperties
    paragraphTiny?: React.CSSProperties
    buttonBig?: React.CSSProperties
    buttonMedium?: React.CSSProperties
    buttonSmall?: React.CSSProperties
    breadCrumbs?: React.CSSProperties
    h4Bold?: React.CSSProperties
    h4Regular?: React.CSSProperties
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    paragraphBig: true
    paragraphMedium: true
    paragraphSmall: true
    paragraphTiny: true
    buttonBig: true
    buttonMedium: true
    buttonSmall: true
    breadCrumbs: true
    h4Bold: true
    h4Regular: true
    body1: false
    body2: false
    subtitle1: false
    subtitle2: false
    button: false
    h4: false
    h6: false
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsSizeOverrides {
    tiny: true
  }
  interface ButtonClasses {
    sizeTiny: string
  }
}

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    tertiary: SimplePaletteColorOptions
    quaternary: SimplePaletteColorOptions
  }
  interface PaletteOptions {
    tertiary: SimplePaletteColorOptions
    quaternary: SimplePaletteColorOptions
  }

  interface TypeBackground {
    backgroundBorder: string
    deepBlue: string
    deepBlueBright: string
    deepBlueDark: string
  }

  interface TypeText {
    tertiary: string
    quaternary: string
    gray: string
    darkGray: string
    disabled: string
  }
}

const white = '#FFFFFF'
const black = '#000000'

const primary = '#151C52'

const secondary = '#D25C96'
const secondaryLight = '#CE4A8B'
const secondaryDark = '#973C7A'

const tertiary = '#F4B407'
const tertiaryLight = '#FFC834'
const tertiaryBright = '#FFD460'

const quaternary = '#35FFC2'

const textPrimary = white
const textSecondary = '#79D2FF'
const textTertiary = '#251E1F'
const textQuaternary = tertiary

const textGray = alpha(white, 0.7)
const textDarkGray = alpha(white, 0.3)
const error = '#FF3D2A'

const background = '#222859'
const backgroundBorder = 'rgba(255, 255, 255, 0.1)'

const deepBlueDark = '#000034'
const deepBlue = '#10163F'
const deepBlueBright = '#5B6086'

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
    borderRadius: 1,
  },
  zIndex: {
    appBar: 1003,
    drawer: 1002,
    modal: 1005,
    tooltip: 1004,
  },
  breakpoints: breakpoints,
  components: {
    MuiInput: {
      styleOverrides: {
        root: {
          overline: 'none',
          border: `1px solid ${backgroundBorder}`,
          borderRadius: 0,
          height: 56,
          padding: '16px 8px',
          '& .MuiInputAdornment-root': {
            color: textGray,
          },
          '&.Mui-focused:not(.Mui-disabled)': {
            border: `1px solid ${textGray}`,
            '& .MuiInputBase-input': {
              color: textGray,
            },
            '& .MuiInputAdornment-root': {
              color: textGray,
            },
          },

          '&:hover:not(.Mui-disabled)': {
            border: `1px solid ${textGray}`,
          },

          '&.Mui-error': {
            border: `1px solid ${error}`,
            '&:hover:not(.Mui-disabled)': {
              border: `2px solid ${error}`,
            },
            '&.Mui-focused:not(.Mui-disabled)': {
              border: `2px solid ${error}`,
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          padding: 0,
          fontFamily: 'IBM Plex Mono',
          fontSize: 16,
          fontWeight: 700,
          lineHeight: '150%',
          letterSpacing: '0.02em',
          [breakpoints.up('md')]: {
            fontSize: 18,
          },

          '&.Mui-disabled': {
            textFillColor: textDarkGray,
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: alpha(secondary, 0.1),
          marginTop: 24,
          marginBottom: 24,
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
        },
        sizeTiny: {
          fontWeight: 500,
          fontSize: 12,
          lineHeight: '125%',
          height: 36,
          padding: '11px 8x',
        },

        sizeSmall: {
          fontSize: 14,
          fontWeight: 500,
          height: 40,
          lineHeight: '125%',
          padding: '11px 16px',
        },

        sizeMedium: {
          fontSize: 14,
          fontWeight: 500,
          height: 48,
          lineHeight: '125%',
          padding: '15px 24px',
        },

        sizeLarge: {
          fontSize: 18,
          fontWeight: 700,
          lineHeight: '125%',
          height: 53,
          padding: '15px 32px',
        },

        contained: {
          color: white,
          backgroundColor: secondaryDark,
          border: `3px solid ${black}`,
          boxShadow: `4px 4px 0px ${black}`,

          '&:hover:not(.Mui-disabled)': {
            backgroundColor: secondaryLight,
            boxShadow: `8px 8px 0px ${black}`,
            border: `3px solid ${black}`,
          },

          '&.Mui-focused:not(.Mui-disabled)': {
            backgroundColor: secondary,
          },

          '&.Mui-disabled': {
            opacity: 0.3,
            color: white,
            backgroundColor: secondaryDark,
            boxShadow: `4px 4px 0px ${black}`,
            border: `3px solid ${black}`,
          },
        },
        containedPrimary: {
          backgroundColor: secondaryDark,
        },
        containedSecondary: {
          color: textTertiary,
          backgroundColor: tertiary,

          '&:hover:not(.Mui-disabled)': {
            backgroundColor: tertiaryLight,
          },

          '&.Mui-focused:not(.Mui-disabled)': {
            backgroundColor: tertiaryBright,
          },

          '&.Mui-disabled': {
            opacity: 0.3,
            color: black,

            backgroundColor: tertiary,
          },
        },
        outlined: {
          background: 'none',
          color: textPrimary,
          border: `2px solid ${textDarkGray}`,

          '&:hover:not(.Mui-disabled)': {
            background: 'none',
            border: `2px solid ${textPrimary}`,
          },

          '&.Mui-focused:not(.Mui-disabled)': {
            border: `2px solid ${textPrimary}`,
            backgroundColor: textGray,
          },

          '&.Mui-disabled': {
            opacity: 0.3,
            color: textGray,
            border: `2px solid ${textDarkGray}`,
          },
        },
        outlinedSecondary: {
          border: `2px solid ${alpha(black, 0.3)}`,
          color: black,

          '&:hover:not(.Mui-disabled)': {
            border: `2px solid ${black}`,
          },

          '&.Mui-focused:not(.Mui-disabled)': {
            border: `2px solid ${black}`,
            backgroundColor: `${alpha(black, 0.1)}`,
          },

          '&.Mui-disabled': {
            color: black,

            border: `2px solid ${alpha(black, 0.3)}`,
            opacity: 0.3,
          },
        },

        text: {
          color: white,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          width: '100%',
          border: `1px solid ${alpha(textPrimary, 0.1)}`,
          boxSizing: 'border-box',
          padding: 4,

          '& > *:not(:last-child)': {
            marginRight: 4,
          },
          '& .MuiToggleButtonGroup-grouped': {
            display: 'flex',
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: textPrimary,
          fontWeight: 600,
          width: '100%',
          borderRadius: 0,
          fontFamily: 'IBM Plex Mono',

          '&.Mui-disabled': {
            color: alpha(textPrimary, 0.3),
          },

          '&.Mui-selected': {
            color: textPrimary,
            background: secondaryDark,
            '&:hover': {
              background: secondaryLight,
            },
          },
        },
      },
    },
    MuiCheckbox: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          whiteSpace: 'pre-line',
        },
      },
    },
    MuiRadio: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          '& .MuiSvgIcon-root': {
            height: 32,
            width: 32,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          padding: 0,
          height: 78,
          [breakpoints.up('md')]: {
            height: 87,
          },
          [breakpoints.up('lg')]: {
            height: 96,
          },
        },
        colorPrimary: {
          backgroundColor: background,
          boxShadow: 'none',
          border: 'none',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          height: '100%',
          paddingRight: 16,
          paddingLeft: 16,

          [breakpoints.up('md')]: {
            paddingRight: 48,
            paddingLeft: 48,
          },

          [breakpoints.up('lg')]: {
            paddingRight: 0,
            paddingLeft: 0,
          },

          [breakpoints.up('xl')]: {
            paddingRight: 72,
            paddingLeft: 72,
          },
        },
      },
      defaultProps: {
        disableGutters: true,
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontWeight: 700,
          fontFamily: 'IBM Plex Mono',
          fontSize: 14,
          lineHeight: '21px',

          '&.Mui-disabled': {
            opacity: 0.3,
            color: textPrimary,
          },

          [breakpoints.up('md')]: {
            fontSize: 15,
            lineHeight: '22.5px',
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        list: {
          padding: 8,
        },
        paper: {
          '&&': {
            padding: 0,
            background: primary,
            boxShadow: `4px 4px 0px ${black}`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          margin: 'auto',
          padding: 16,

          [breakpoints.up('md')]: {
            padding: 24,
          },

          border: 'none',
          boxShadow: 'none',
          backgroundColor: primary,
        },
        rounded: {
          borderRadius: 0,
        },
        elevation1: {
          border: 'none',
          boxShadow: `2px 2px 0px ${black}`,
          backgroundColor: primary,
        },
        elevation2: {
          border: 'none',
          boxShadow: `4px 4px 0px ${black}`,
          backgroundColor: primary,
        },
        elevation3: {
          boxShadow: `6px 6px 0px ${black}`,
          backgroundColor: primary,
        },
      },
    },

    MuiSlider: {
      styleOverrides: {
        root: {
          color: tertiaryLight,
          backgroundColor: black,
          borderRadius: 0,
          border: `2px solid ${black}`,
          padding: 0,
          transition: 'none',
          width: 'calc(100% - 4px)',
        },
        track: {
          height: '2px',
        },
        rail: {
          color: black,
          opacity: 1,
        },
        thumb: {
          border: `1px solid ${black}`,
          boxShadow: `2px 2px 0px ${black}`,
          transition: 'none',
          width: '24px',
          height: '24px',
          '&:hover': {
            color: tertiaryBright,
            boxShadow: `3px 3px 0px ${black}`,
          },
          '&::after': {
            width: '24px',
            height: '24px',
            boxShadow: `2px 2px 0px ${black}`,
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'collapse',
          borderSpacing: '0px 10x',
          backgroundColor: primary,
          padding: 0,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.MuiTableRow-hover:hover': {
            backgroundColor: alpha(textSecondary, 0.1),
          },

          borderTop: `1px solid ${backgroundBorder}`,
          borderBottom: 'none',
          '&:last-child': {
            borderBottom: `1px solid ${backgroundBorder}`,
          },
        },
        head: {
          backgroundColor: primary,
          borderTop: 'none',

          color: textSecondary,
          '&.MuiTableRow-hover:hover': {
            backgroundColor: alpha(textSecondary, 0.1),
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          '&&': {
            paddingX: 24,
            paddingY: 12,
          },
        },
        head: {
          '&:last-child': {
            borderRight: 'none',
          },

          color: textSecondary,
          fontWeight: 600,
          fontSize: 14,
          lineHeight: '21px',

          borderTop: 'none',
          borderBottom: 'none',
          borderRight: `1px solid ${backgroundBorder}`,
        },
        body: {
          borderRight: `1px solid ${backgroundBorder}`,
          borderLeft: `1px solid ${backgroundBorder}`,

          borderTop: 'none',
          borderBottom: 'none',

          '&:nth-of-type(1)': {
            borderLeft: 'none',
          },
          '&:last-child': {
            borderRight: 'none',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          display: 'flex',
          alignItems: 'center',
          paddingTop: '8px',
          height: '100%',
          width: '100%',
          borderRadius: 3,
          color: alpha(textSecondary, 0.7),

          '&:hover': {
            color: textSecondary,
            background: alpha(textSecondary, 0.3),
          },
          '&.Mui-selected': {
            color: black,
            background: textSecondary,
            '&:hover': {
              color: textSecondary,
              background: alpha(textSecondary, 0.3),
            },
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '0px',
          height: '100%',
          width: '100%',
          boxSizing: 'border-box',
          '&.Mui-selected': {
            background: 'none',
          },
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        separator: {
          marginLeft: 8,
          marginRight: 8,
          marginTop: 4,
          fontSize: 12,

          color: textPrimary,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          '& .MuiDialog-paper': {
            paddingLeft: 16,
            paddingRight: 16,
            [breakpoints.up('md')]: {
              paddingLeft: 32,
              paddingRight: 32,
            },
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '17px 17px',
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          paragraphBig: 'p',
          paragraphMedium: 'p',
          paragraphSmall: 'p',
          buttonBig: 'p',
          buttonMedium: 'p',
          buttonSmall: 'p',
          breadCrumbs: 'p',
        },
        variant: 'paragraphMedium',
      },
    },
  },

  palette: {
    primary: {
      main: primary,
    },
    secondary: {
      main: secondary,
    },
    tertiary: {
      light: tertiaryLight,
      main: tertiary,
    },
    quaternary: {
      main: quaternary,
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
      tertiary: textTertiary,
      quaternary: textQuaternary,
      gray: textGray,
      darkGray: textDarkGray,
    },
    warning: {
      main: tertiary,
    },
    error: {
      main: error,
    },
    success: {
      main: quaternary,
    },
    background: {
      default: background,
      paper: primary,
      backgroundBorder: backgroundBorder,
      deepBlue: deepBlue,
      deepBlueDark: deepBlueDark,
      deepBlueBright: deepBlueBright,
    },
    common: {
      white: white,
      black: black,
    },
  },

  typography: {
    fontFamily: ['IBM Plex Mono', 'Sarpanch'].join(','),
    h1: {
      fontFamily: 'Sarpanch',
      fontSize: 26,
      lineHeight: '125%',
      fontWeight: 700,
      [breakpoints.up('md')]: {
        fontSize: 40,
      },
    },
    h2: {
      fontFamily: 'Sarpanch',
      fontSize: 22,
      lineHeight: '125%',
      fontWeight: 700,

      [breakpoints.up('md')]: {
        fontSize: 32,
      },
    },
    h3: {
      fontFamily: 'IBM Plex Mono',
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: '0.02em',
      lineHeight: '150%',
      [breakpoints.up('md')]: {
        fontSize: 24,
      },
    },

    h4Bold: {
      fontFamily: 'Sarpanch',
      fontWeight: 700,
      fontSize: 14,
      lineHeight: '125%',
      [breakpoints.up('md')]: {
        fontSize: 22,
      },
    },
    h4Regular: {
      fontFamily: 'Sarpanch',
      fontWeight: 500,
      fontSize: 14,
      lineHeight: '125%',
      [breakpoints.up('md')]: {
        fontSize: 22,
      },
    },

    h5: {
      fontWeight: 700,
      fontFamily: 'IBM Plex Mono',
      fontSize: 12,
      lineHeight: '150%',
      letterSpacing: '0.02em',

      [breakpoints.up('md')]: {
        fontSize: 20,
      },
    },

    paragraphBig: {
      fontFamily: 'IBM Plex Mono',
      fontSize: 16,
      fontWeight: 700,
      lineHeight: '150%',
      letterSpacing: '0.02em',
      [breakpoints.up('md')]: {
        fontSize: 18,
      },
    },
    paragraphMedium: {
      fontFamily: 'IBM Plex Mono',
      fontSize: 14,
      fontWeight: 400,
      lineHeight: '150%',
      letterSpacing: '0.02em',
      [breakpoints.up('md')]: {
        fontSize: 16,
      },
    },
    paragraphSmall: {
      fontFamily: 'IBM Plex Mono',
      fontSize: 12,
      fontWeight: 600,
      lineHeight: '150%',
      letterSpacing: '0.02em',
      [breakpoints.up('md')]: {
        fontSize: 14,
      },
    },
    paragraphTiny: {
      fontFamily: 'IBM Plex Mono',
      fontSize: 10,
      fontWeight: 500,
      lineHeight: '150%',
      letterSpacing: '0.02em',
      [breakpoints.up('md')]: {
        fontSize: 12,
      },
    },
    caption: {
      fontWeight: 400,
      fontFamily: 'IBM Plex Mono',
      fontSize: 11,
      letterSpacing: '0.02em',
      lineHeight: '150%',
      [breakpoints.up('md')]: {
        fontSize: 13,
      },
    },

    buttonBig: {
      fontFamily: 'IBM Plex Mono',
      fontWeight: 700,
      fontSize: 22,
      letterSpacing: '0.02em',
      lineHeight: '125%',
    },
    buttonMedium: {
      fontFamily: 'IBM Plex Mono',
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: '0.02em',
      lineHeight: '125%',
    },
    buttonSmall: {
      fontFamily: 'IBM Plex Mono',
      fontWeight: 500,
      fontSize: 14,
      letterSpacing: '0.02em',
      lineHeight: '125%',
    },
    breadCrumbs: {
      fontFamily: 'IBM Plex Mono',
      fontWeight: 500,
      fontSize: 12,
      letterSpacing: '0.05em',
      lineHeight: '150%',
    },
  },
})

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => (
  <MUIThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </MUIThemeProvider>
)
