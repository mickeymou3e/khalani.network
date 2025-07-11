import variables from '@/styles/exports/exports.module.scss'

const getBreakpoints = () => {
  const breakpoints = {}

  for (let value in variables) {
    if (value.includes('breakpoint')) {
      const key = value.replace('breakpoint-', '')
      const breakpointNumber = parseInt(variables[value].replace('px', ''))
      breakpoints[key] = breakpointNumber
    }
  }

  return breakpoints
}

export default getBreakpoints
