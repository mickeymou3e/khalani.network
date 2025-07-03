import { ScreenSize } from './theme.types'

export const bigDesktopTypography = {
  fontFamily: 'Courier',
  h1: {
    fontFamily: 'Agency FB',
    fontSize: 'calc(4.5vh + 4.5vw)',
    lineHeight: 1,
  },
  h2: {
    fontFamily: 'Agency FB',
    fontSize: 'calc(3vh + 3vw)',
    lineHeight: 1.25,
  },
  subtitle1: {
    fontSize: 'calc(1.5vh + 1.5vw)',
    fontWeight: 700,
  },
  subtitle2: {
    fontSize: 'calc(1.1vh + 1.1vw)',
    fontWeight: 300,
  },
  body1: {
    fontSize: 'calc(1.25vh + 1.25vw)',
    fontWeight: 300,
  },
  body2: {
    fontSize: 'calc(1.1vh + 1.1vw)',
    fontWeight: 300,
  },
}

export const desktopTypography = {
  fontFamily: 'Courier',
  h1: {
    fontFamily: 'Agency FB',
    fontSize: 'calc(4vh + 4vw)',
    lineHeight: 1,
  },
  h2: {
    fontFamily: 'Agency FB',
    fontSize: 'calc(2.5vh + 2.5vw)',
    lineHeight: 1.25,
  },
  subtitle1: {
    fontSize: 'calc(1.25vh + 1.25vw)',
    fontWeight: 700,
  },
  subtitle2: {
    fontSize: 'calc(1vh + 1vw)',
    fontWeight: 300,
  },
  body1: {
    fontSize: 'calc(1vh + 1vw)',
    fontWeight: 300,
  },
  body2: {
    fontSize: 'calc(0.75vh + 0.75vw)',
    fontWeight: 300,
  },
}

export const tabletTypography = {
  fontFamily: 'Courier',
  h1: {
    fontFamily: 'Agency FB',
    fontSize: '70px',
    lineHeight: 1,
  },
  h2: {
    fontFamily: 'Agency FB',
    fontSize: '38px',
    lineHeight: 1.25,
  },
  subtitle1: {
    fontSize: '24px',
    fontWeight: 700,
  },
  subtitle2: {
    fontSize: '20px',
    fontWeight: 300,
  },
  body1: {
    fontSize: '24px',
    fontWeight: 300,
  },
  body2: {
    fontSize: '18px',
    fontWeight: 300,
  },
}

export const typographySettings = {
  [ScreenSize.TABLET]: tabletTypography,
  [ScreenSize.DESKTOP]: desktopTypography,
  [ScreenSize.BIG_DESKTOP]: bigDesktopTypography,
}
