import { BorrowType } from '@constants/Lending'
import { getConfig } from '@hadouken-project/lending-contracts'
import { ENVIRONMENT } from '@utils/stringOperations'

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

export const getBorrowTypeName = (type: BorrowType): string => {
  switch (type) {
    case BorrowType.stable:
      return 'Fixed'

    case BorrowType.variable:
      return 'Variable'

    default:
      return 'Borrow type missing'
  }
}

export const getNextBorrowTypeName = (type?: BorrowType): string => {
  switch (type) {
    case BorrowType.stable:
      return 'Variable'

    case BorrowType.variable:
      return 'Stable'

    default:
      return 'Borrow type missing'
  }
}

export const getBorrowType = (type: string): BorrowType | undefined => {
  switch (type) {
    case 'Stable':
      return BorrowType.stable

    case 'Variable':
      return BorrowType.variable

    default:
      return undefined
  }
}

export const convertSymbolToDisplayValue = (
  symbol: string,
  chainId?: string,
  tokenAddress?: string,
): string => {
  const config = getConfig(chainId)?.(ENVIRONMENT)

  const token = config?.tokens?.find(
    (x) => x.address.toLowerCase() === tokenAddress?.toLowerCase(),
  )
  if (token) {
    return token.displaySymbol
  }

  if (
    tokenAddress &&
    tokenAddress.toLowerCase() === config?.nativeToken?.address?.toLowerCase()
  ) {
    return config?.nativeToken?.symbol
  }

  let symbolWithoutDirection = symbol.split('.')[0]
  symbolWithoutDirection = symbolWithoutDirection.split('|')[0]

  if (symbolWithoutDirection[0] === 'c' && symbolWithoutDirection[1] === 'k') {
    symbolWithoutDirection = symbolWithoutDirection.slice(2)
  }

  return symbolWithoutDirection
}
