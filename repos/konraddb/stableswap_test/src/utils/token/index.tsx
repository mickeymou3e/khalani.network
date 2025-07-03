import {
  DAI,
  ETH,
  hUSDC,
  hUSDT,
  PAN,
  USDC,
  USDT,
  WBTC,
} from '@dataSource/graph/pools/poolsTokens/constants'
import { BigNumber } from '@ethersproject/bignumber'
import { ERC20 } from '@hadouken-project/stableswap-contracts'
import { TokenModel } from '@hadouken-project/ui'
import { IToken } from '@interfaces/token'
import { ITokenModelBalanceWithChain } from '@store/khala/tokens/tokens.types'

export const sortTokensByAddressOrder = (addressOrder: string[]) => (
  tokA: ERC20 | IToken,
  tokB: ERC20 | IToken,
): number => {
  if (addressOrder.indexOf(tokA.address) < addressOrder.indexOf(tokB.address)) {
    return -1
  }
  if (addressOrder.indexOf(tokA.address) > addressOrder.indexOf(tokB.address)) {
    return 1
  }

  return 0
}

/** Assume that smallest slippage is 0.01% */
export const subtractSlippageFromValue = (
  value: BigNumber,
  slippage: number,
): BigNumber => {
  if (slippage === 0) return value

  if (slippage < 0.01) return value

  return value.mul(10000 - slippage * 100).div(10000)
}

export const addSlippageToValue = (
  value: BigNumber,
  slippage: number,
): BigNumber => {
  if (slippage === 0) return value

  if (slippage < 0.01) return value

  return value.mul(10000 + slippage * 100).div(10000)
}

export const isPopularToken = (tokenAddress: IToken['address']): boolean => {
  return [DAI, USDC, USDT, ETH, WBTC]
    .map(({ address }) => address.toLowerCase())
    .includes(tokenAddress)
}

export const isDebtToken = (tokenAddress: IToken['address']): boolean => {
  return [hUSDC.address.toLowerCase(), hUSDT.address.toLowerCase()].includes(
    tokenAddress,
  )
}

export const getDebtUnderlying = (
  tokenAddress: IToken['address'],
): IToken['address'] => {
  return {
    [hUSDC.address.toLowerCase()]: USDC.address.toLowerCase(),
    [hUSDT.address.toLowerCase()]: USDT.address.toLowerCase(),
  }[tokenAddress]
}

export const findUSDCToken = (
  depositTokens: TokenModel[] | ITokenModelBalanceWithChain[],
): TokenModel | ITokenModelBalanceWithChain | undefined => {
  return depositTokens.find((token) => token.symbol.includes(USDC.symbol))
}

export const findPANToken = (
  depositTokens: TokenModel[] | ITokenModelBalanceWithChain[],
): TokenModel | ITokenModelBalanceWithChain | undefined => {
  return depositTokens.find((token) => token.symbol.includes(PAN.symbol))
}
