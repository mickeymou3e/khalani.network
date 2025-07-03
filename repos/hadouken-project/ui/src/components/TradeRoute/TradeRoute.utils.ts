export const getButtonWidth = (
  tokensLength: number,
  isDesktop: boolean,
): string => {
  switch (tokensLength) {
    case 1: {
      return isDesktop ? '34px' : '24px'
    }
    case 2: {
      return isDesktop ? '52px' : '40px'
    }
    case 3: {
      return isDesktop ? '68px' : '53px'
    }
    case 4: {
      return isDesktop ? '85px' : '66px'
    }
    default: {
      return isDesktop ? '69px' : '54px'
    }
  }
}
