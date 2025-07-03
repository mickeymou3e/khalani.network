import { BigNumber, ethers } from 'ethers'

import { getChainConfig } from '@config'
import { address } from '@dataSource/graph/utils/formatters'
import { IPool } from '@interfaces/pool'
import { Balances } from '@interfaces/token'

export const isWrapEthInsideTokens = (
  chainId: string,
  tokens: string[],
): boolean => {
  const config = getChainConfig(chainId)

  const wEthIndex = tokens.findIndex(
    (token) =>
      address(token) === address(config.nativeCurrency.wrapAddress ?? ''),
  )

  const isWEth = wEthIndex > -1

  return isWEth
}

export const findWrapEthWithAmount = (
  chainId: string,
  tokens: string[],
  amounts: BigNumber[],
): { isWEth: boolean; ethAmount: BigNumber } => {
  const config = getChainConfig(chainId)

  const wEthIndex = tokens.findIndex(
    (token) =>
      address(token) === address(config.nativeCurrency.wrapAddress ?? ''),
  )

  const isWEth = wEthIndex > -1
  const ethAmount = isWEth ? amounts[wEthIndex] : BigNumber.from(0)

  return {
    isWEth,
    ethAmount,
  }
}

export const replaceWrapEthTokenInPool = (
  chainId: string,
  pools: IPool[],
): IPool[] => {
  const config = getChainConfig(chainId)

  const { nativeCurrency } = config

  return pools.map((pool) => {
    return {
      ...pool,
      tokens: pool.tokens.map((token) => {
        return {
          ...token,
          address:
            address(nativeCurrency.wrapAddress ?? '') === address(token.address)
              ? nativeCurrency.address
              : token.address,
        }
      }),
    }
  })
}

export const replaceWrapEthToken = (
  chainId: string,
  tokens: string[],
): string[] => {
  const config = getChainConfig(chainId)

  const wEthIndex = tokens.findIndex(
    (tok) => address(tok) === address(config.nativeCurrency.wrapAddress ?? ''),
  )

  const isWEth = wEthIndex > -1

  return isWEth
    ? tokens.map((token) => {
        if (
          address(token) === address(config.nativeCurrency?.wrapAddress ?? '')
        ) {
          return ethers.constants.AddressZero
        }

        return token
      })
    : tokens
}

export const replaceWrapEthBalances = (
  chainId: string,
  balances: Balances,
): Balances => {
  const config = getChainConfig(chainId)

  return config.nativeCurrency.wrapAddress && balances
    ? {
        ...balances,
        [config.nativeCurrency.address]:
          balances[address(config.nativeCurrency.wrapAddress)],
      }
    : balances
}
