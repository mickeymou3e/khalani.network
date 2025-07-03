import { ScreenSize } from './theme.types'

export const bigDesktopTypography = {
  fontFamily: 'Courier',
  h1: {
    fontFamily: 'Agency FB',
    fontSize: 'calc(3.5vh + 3.5vw)',
    lineHeight: 1,
  },
  h2: {
    fontFamily: 'Agency FB',
    fontSize: 'calc(2.75vh + 2.75vw)',
    lineHeight: 1.25,
  },
  h3: {
    fontFamily: 'Agency FB',
    fontSize: 100,
    letterSpacing: '1.5px',
  },
  button: {
    fontSize: 'calc(1vh + 1vw)',
    fontWeight: 700,
  },
  subtitle2: {
    fontFamily: `Courier New`,
    fontSize: 'calc(0.75vh + 0.75vw)',
    fontWeight: 300,
  },
  body1: {
    fontSize: 'calc(1vh + 1vw)',
    fontWeight: 500,
  },
  body2: {
    fontSize: 'calc(1.1vh + 1.1vw)',
    fontWeight: 300,
  },
}

export const largeHeightTypography = {
  fontFamily: 'Courier',
  h1: {
    fontFamily: 'Agency FB',
    fontSize: 'calc(3.75vh + 3.75vw)',
    lineHeight: 1,
  },
  h2: {
    fontFamily: 'Agency FB',
    fontSize: 'calc(2.5vh + 2.5vw)',
    lineHeight: 1.25,
    '@media (max-width: 2000px)': {
      fontSize: 'calc(2.3vh + 2.3vw)',
    },
    '@media (max-width: 1500px)': {
      fontSize: 'calc(2vh + 2vw)',
    },
  },
  h3: {
    fontFamily: 'Agency FB',
    fontSize: 85,
    letterSpacing: '1.5px',
    '@media (max-width: 2000px)': {
      fontSize: undefined,
    },
    '@media (max-width: 1555px)': {
      fontSize: 56,
    },
  },
  button: {
    fontSize: 'calc(1vh + 1vw)',
    fontWeight: 700,
    '@media (max-width: 2000px)': {
      fontSize: 'calc(1vh + 1vw)',
    },
  },
  subtitle2: {
    fontSize: 'calc(0.7vh + 0.7vw)',
    fontWeight: 300,
    // '@media (max-width: 2000px)': {
    //   fontSize: 'calc(0.8vh + 0.8vw)',
    // },
    // '@media (max-width: 1500px)': {
    //   fontSize: 'calc(0.7vh + 0.7vw)',
    // },
  },
  body1: {
    fontSize: 'calc(1vh + 1vw)',
    fontWeight: 500,
  },
  body2: {
    fontSize: 'calc(1.1vh + 1.1vw)',
    fontWeight: 300,
  },
}

export const superLargeHeightTypography = {
  fontFamily: 'Courier',
  h1: {
    fontFamily: 'Agency FB',
    fontSize: 'calc(3.5vh + 3.5vw)',
    lineHeight: 1,
  },
  h2: {
    fontFamily: 'Agency FB',
    fontSize: 'calc(2.5vh + 2.5vw)',
    lineHeight: 1.25,
    '@media (max-width: 2500px)': {
      fontSize: 'calc(2.1vh + 2.1vw)',
    },
  },
  h3: {
    fontFamily: 'Agency FB',
    fontSize: 100,
    letterSpacing: '1.5px',
  },
  button: {
    fontSize: 'calc(1vh + 1vw)',
    fontWeight: 700,
  },
  subtitle2: {
    fontSize: 'calc(0.7vh + 0.7vw)',
    fontWeight: 300,
    // '@media (max-width: 2500px)': {
    //   fontSize: 'calc(0.6vh + 0.6vw)',
    // },
  },
  body1: {
    fontSize: 'calc(1vh + 1vw)',
    fontWeight: 500,
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
    fontSize: 'calc(3vh + 3vw)',
    lineHeight: 1,
  },
  h2: {
    fontFamily: 'Agency FB',
    fontSize: 'calc(2.5vh + 2.5vw)',
    lineHeight: 1.25,
  },
  h3: {
    fontFamily: 'Agency FB',
    fontSize: 80,
    letterSpacing: '1.5px',
    '@media (max-width: 1555px)': {
      fontSize: 56,
    },
  },
  button: {
    fontSize: 'calc(0.8vh + 0.8vw)',
    fontWeight: 700,
  },
  subtitle2: {
    fontSize: 'calc(0.75vh + 0.75vw)',
    fontWeight: 300,
  },
  body1: {
    fontSize: 'calc(0.8vh + 0.8vw)',
    fontWeight: 500,
  },
  body2: {
    fontSize: 'calc(0.75vh + 0.75vw)',
    fontWeight: 300,
  },
}

export const mediumDesktopTypography = {
  fontFamily: 'Courier',
  h1: {
    fontFamily: 'Agency FB',
    fontSize: 'calc(2.5vh + 2.5vw)',
    lineHeight: 1,
  },
  h2: {
    fontFamily: 'Agency FB',
    fontSize: 'calc(2.25vh + 2.25vw)',
    lineHeight: 1.25,
  },
  h3: {
    fontFamily: 'Agency FB',
    fontSize: 70,
  },
  button: {
    fontSize: 'calc(0.8vh + 0.8vw)',
    fontWeight: 700,
  },
  subtitle2: {
    fontSize: 16,
    fontWeight: 300,
  },
  body1: {
    fontSize: 25,
    fontWeight: 500,
  },
  body2: {
    fontSize: 'calc(0.75vh + 0.75vw)',
    fontWeight: 300,
  },
}

export const smallDesktopTypography = {
  fontFamily: 'Courier',
  h1: {
    fontFamily: 'Agency FB',
    fontSize: '50px',
    lineHeight: 1,
  },
  h2: {
    fontFamily: 'Agency FB',
    fontSize: '45px',
    lineHeight: 1.25,
  },
  h3: {
    fontFamily: 'Agency FB',
    fontSize: 38,
    letterSpacing: '1.5px',
  },
  button: {
    fontSize: 18,
    fontWeight: 700,
  },
  subtitle2: {
    fontSize: '12px',
    fontWeight: 300,
  },
  body1: {
    fontSize: 18,
    fontWeight: 500,
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
    fontSize: '40px',
    lineHeight: 1,
  },
  h2: {
    fontFamily: 'Agency FB',
    fontSize: '35px',
    lineHeight: 1.25,
  },
  h3: {
    fontFamily: 'Agency FB',
    letterSpacing: '1.5px',
    fontSize: 40,
  },
  button: {
    fontSize: '16px',
    fontWeight: 700,
  },
  subtitle2: {
    fontSize: '12px',
    fontWeight: 300,
  },
  body1: {
    fontSize: '18px',
    fontWeight: 500,
  },
  body2: {
    fontSize: '16px',
    fontWeight: 300,
  },
}

export const mobileTypography = {
  fontFamily: 'Courier',
  h1: {
    fontFamily: 'Agency FB',
    fontSize: '25px',
    lineHeight: 1,
  },
  h2: {
    fontFamily: 'Agency FB',
    fontSize: '24px',
    lineHeight: 1.25,
  },
  h3: {
    fontFamily: 'Agency FB',
    letterSpacing: '1.5px',
    fontSize: 37,
  },
  button: {
    fontSize: '12px',
    fontWeight: 700,
  },
  subtitle2: {
    fontSize: '12px',
    fontWeight: 300,
  },
  body1: {
    fontSize: '12px',
    fontWeight: 500,
  },
  body2: {
    fontSize: '16px',
    fontWeight: 300,
  },
}

export const typographySettings = {
  [ScreenSize.MOBILE]: mobileTypography,
  [ScreenSize.TABLET]: tabletTypography,
  [ScreenSize.SMALL_DESKTOP]: smallDesktopTypography,
  [ScreenSize.MEDIUM_DESKTOP]: mediumDesktopTypography,
  [ScreenSize.LARGE_HEIGHT]: largeHeightTypography,
  [ScreenSize.SUPER_LARGE_HEIGHT]: superLargeHeightTypography,
  [ScreenSize.DESKTOP]: desktopTypography,
  [ScreenSize.BIG_DESKTOP]: bigDesktopTypography,
}
