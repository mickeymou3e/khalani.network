import { formatTokenSymbol } from './tokens'

export const formatPoolName = (poolName: string): string => {
  const splittedName = poolName.split('/')

  return `${formatTokenSymbol(splittedName[0])} ${
    splittedName[1] ? `- ${splittedName[1]}` : ''
  }`
}
