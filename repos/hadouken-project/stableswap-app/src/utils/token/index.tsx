import { BOOSTED_POOLS_SYMBOL_LOWER_CASE } from '@components/PoolTable/PoolTable.constants'
import { getLendingEnvironment } from '@config'
import { address } from '@dataSource/graph/utils/formatters'
import { BigNumber } from '@ethersproject/bignumber'
import { getContractsConfig } from '@hadouken-project/lending-contracts'
import { IContractsConfig } from '@hadouken-project/lending-contracts/dist/types'
import { ERC20 } from '@hadouken-project/typechain'
import { IToken } from '@interfaces/token'

import { getTokens } from '../../dataSource/graph/pools/poolsTokens/constants'

const mainTokens = ['pCKB', 'ETH', 'USDT', 'USDC', 'WBTC']
export const getPopularTokensList = (chainId: string): IToken[] => {
  const tokens = getTokens(chainId)
  const initValue: IToken[] = []

  return mainTokens.reduce((acc, mainToken) => {
    const foundToken = tokens.find(
      (token) => token.symbol.toLowerCase() === mainToken.toLowerCase(),
    )
    if (foundToken) acc.push(foundToken)
    return acc
  }, initValue)
}

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

export const isPopularToken = (
  tokenAddress: IToken['address'],
  chainId: string,
): boolean => {
  return getPopularTokensList(chainId)
    .map(({ address: tokenAddress }) => address(tokenAddress))
    .includes(tokenAddress)
}

export const getLendingConfig = (chainId: string): IContractsConfig =>
  getContractsConfig(chainId)?.(getLendingEnvironment()) as IContractsConfig

export const isDebtToken = (
  tokenAddress: IToken['address'],
  chainId: string,
): boolean => {
  const lendingConfig = getLendingConfig(chainId)
  const aTokenList = Object.values(
    lendingConfig.tokens,
  ).map(({ aTokenAddress }) => address(aTokenAddress ?? ''))
  return aTokenList.includes(address(tokenAddress))
}

export const getDebtUnderlying = (
  tokenAddress: IToken['address'],
  chainId: string,
): IToken['address'] | undefined => {
  const lendingConfig = getLendingConfig(chainId)
  return Object.values(lendingConfig.tokens).find(
    ({ aTokenAddress }) =>
      address(aTokenAddress ?? '') === address(tokenAddress),
  )?.address
}

const TokenOrder = ['ckb', 'eth', 'bnb', 'wbtc', 'busd', 'usdc', 'usdt']

// if return > 0  tokenTwo before TokenOne
// if return < 0 tokenOne before tokenTwo
// if return = 0 no changes in order
export const sortAssetsByBusinessOrder = (
  tokenOneSymbol: string,
  tokenTwoSymbol: string,
): number => {
  if (BOOSTED_POOLS_SYMBOL_LOWER_CASE.includes(tokenOneSymbol.toLowerCase())) {
    return -1
  } else if (
    BOOSTED_POOLS_SYMBOL_LOWER_CASE.includes(tokenTwoSymbol.toLowerCase())
  ) {
    return 1
  }

  if (tokenOneSymbol.toUpperCase().includes('HDK-LNR')) {
    return -1
  }

  if (tokenTwoSymbol.toUpperCase().includes('HDK-LNR')) {
    return 1
  }

  const firstTokenIndex = TokenOrder.indexOf(tokenOneSymbol.toLowerCase())
  const secondTokenIndex = TokenOrder.indexOf(tokenTwoSymbol.toLowerCase())

  if (firstTokenIndex === -1 && secondTokenIndex === -1) {
    return 0
  } else if (firstTokenIndex === -1) {
    return 1
  } else if (secondTokenIndex === -1) {
    return -1
  }

  return firstTokenIndex - secondTokenIndex
}
