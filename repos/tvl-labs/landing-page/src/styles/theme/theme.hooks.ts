import { useMediaQuery } from '@mui/material'
import { ScreenSize } from './theme.types'

export const useScreenSize = () => {
  const isMobile = useMediaQuery('(max-width:450px)')
  const isTablet = useMediaQuery('(max-width:1008px)')
  const isSmallDesktop = useMediaQuery('(max-width:1240px)')
  const isMediumDesktop = useMediaQuery('(max-width:1560px)')
  const isLargeHeight = useMediaQuery(
    '(max-width:2500px) and (min-height: 1100px)',
  )
  const isSuperLargeHeight = useMediaQuery(
    '(min-width:2000px) and (min-height: 1601px)',
  )
  const isDesktop = useMediaQuery('(max-width:1920px)')

  if (isMobile) {
    return ScreenSize.MOBILE
  } else if (isTablet) {
    return ScreenSize.TABLET
  } else if (isSmallDesktop) {
    return ScreenSize.SMALL_DESKTOP
  } else if (isMediumDesktop) {
    return ScreenSize.MEDIUM_DESKTOP
  } else if (isLargeHeight) {
    return ScreenSize.LARGE_HEIGHT
  } else if (isSuperLargeHeight) {
    return ScreenSize.SUPER_LARGE_HEIGHT
  } else if (isDesktop) {
    return ScreenSize.DESKTOP
  } else {
    return ScreenSize.BIG_DESKTOP
  }
}
