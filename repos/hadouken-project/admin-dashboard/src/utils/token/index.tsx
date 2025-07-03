import { getContractsConfig } from '@utils/config'

export const sortTokensByAddressOrder = (addressOrder: string[]) => (
  tokA: { address: string },
  tokB: { address: string },
): number => {
  if (addressOrder.indexOf(tokA.address) < addressOrder.indexOf(tokB.address)) {
    return -1
  }
  if (addressOrder.indexOf(tokA.address) > addressOrder.indexOf(tokB.address)) {
    return 1
  }

  return 0
}

export const convertSymbolToDisplayValue = (
  symbol: string,
  tokenAddress: string,
): string => {
  const config = getContractsConfig()

  if (tokenAddress.toLowerCase() === config.nativeToken.address.toLowerCase()) {
    return config.nativeToken.symbol
  }

  let symbolWithoutDirection = symbol.split('.')[0]
  symbolWithoutDirection = symbolWithoutDirection.split('|')[0]

  if (symbolWithoutDirection[0] === 'c' && symbolWithoutDirection[1] === 'k') {
    symbolWithoutDirection = symbolWithoutDirection.slice(2)
  }

  return symbolWithoutDirection
}
