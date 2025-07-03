import { useMediaQuery } from '@mui/material'
import { ScreenSize } from './theme.types'

export const useScreenSize = () => {
  const isTablet = useMediaQuery('(max-width:899px)')
  const isDesktop = useMediaQuery('(min-width:1025px) and (max-width:1920px)')

  if (isTablet) {
    return ScreenSize.TABLET
  } else if (isDesktop) {
    return ScreenSize.DESKTOP
  } else {
    return ScreenSize.BIG_DESKTOP
  }
}
