import getBreakpoints from '@/helpers/getBreakpoints'
import useMatchMedia from '@/hooks/useMatchMedia'

const useBreakpoint = (key, check = 'above', options) => {
  const breakpoints = getBreakpoints()

  const breakpoint = breakpoints[key]
  const breakpointTested = check === 'above' ? breakpoint : breakpoint - 1
  const limit = check === 'above' ? 'min' : 'max'

  const isMatching = useMatchMedia(`(${limit}-width: ${breakpointTested}px)`, options)

  return isMatching
}

export default useBreakpoint
