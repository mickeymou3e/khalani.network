import config from '@config'
import { TokenModel } from '@store/tokens/tokens.types'

interface PartialERC20 {
  address: string
}

export const formatTokenName = (tokenName: string) => tokenName?.split(' | ')[0]

export const formatTokenSymbol = (
  tokenSymbol: string | undefined,
): string | undefined => {
  const match = tokenSymbol?.match(/[A-Z]+/)
  if (!match) return

  return match[0]
}

export const sortTokensByAddressOrder =
  (addressOrder: string[]) =>
  (
    tokA: PartialERC20 | TokenModel,
    tokB: PartialERC20 | TokenModel,
  ): number => {
    if (
      addressOrder.indexOf(tokA.address) < addressOrder.indexOf(tokB.address)
    ) {
      return -1
    }
    if (
      addressOrder.indexOf(tokA.address) > addressOrder.indexOf(tokB.address)
    ) {
      return 1
    }

    return 0
  }

export const findMToken = (symbol: string, sourceChainId: string) =>
  config.mTokens.find(
    (token) =>
      token.symbol.includes(symbol.split('.')[0]) &&
      token.sourceChainId === sourceChainId,
  )
export const findSpokeToken = (symbol: string, sourceChainId: string) =>
  config.tokens.find(
    (token) =>
      token.symbol.includes(symbol.split('.')[0]) &&
      token.chainId === sourceChainId,
  )
