import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import { TokenModelBalance } from '@hadouken-project/ui'
import { PoolTokenBalance } from '@interfaces/token'
import { userBalancesSelectors } from '@store/balances/selectors/user/balances.selector'
import { lendingSelectors } from '@store/lending/lending.selector'
import { pricesSelector } from '@store/prices/prices.selector'
import { swapSelectors } from '@store/swap/swap.selector'
import { BigDecimal } from '@utils/math'

import { BaseAndQuoteToken } from './SwapModule.types'
import { sortByTokenBalance } from './SwapModule.utils'

const getTokenWithBalance = (
  tokenAddress: string | undefined,
  selectUserTokensBalances: (
    tokenAddress: string,
  ) => BigDecimal | null | undefined,
  tokens: TokenModelBalance[],
): TokenModelBalance | undefined => {
  const token = tokens.find((token) => token.address === tokenAddress)

  if (!token) return undefined

  const balance =
    selectUserTokensBalances(token.address)?.toBigNumber() ?? BigNumber.from(0)

  return {
    ...token,
    balance,
  }
}

export const useSwapTokens = (
  tokens: PoolTokenBalance[],
): BaseAndQuoteToken => {
  const { baseTokenAddress, quoteTokenAddress } = useSelector(
    swapSelectors.swapTokensAddresses,
  )

  const lendingTokenMappings = useSelector(
    lendingSelectors.allWrappedToHTokenMappings,
  )

  const prices = useSelector(pricesSelector.selectAll)

  const wrappedHTokensAddresses = lendingTokenMappings.map(
    ({ wrappedHToken }) => wrappedHToken,
  )

  const sortedTokens = useMemo(() => {
    return tokens
      .filter(({ address }) => !wrappedHTokensAddresses.includes(address))
      .map((poolTokenBalance) => {
        return {
          id: poolTokenBalance.id,
          symbol: poolTokenBalance.symbol,
          name: poolTokenBalance.name,
          address: poolTokenBalance.address,
          decimals: poolTokenBalance.decimals,
          balance: poolTokenBalance.balance.toBigNumber(),
          displayName: poolTokenBalance.displayName ?? poolTokenBalance.name,
          source: poolTokenBalance.source,
        } as TokenModelBalance
      })
      .sort((tokA, tokB) => sortByTokenBalance(tokA, tokB, prices))
  }, [tokens, prices, wrappedHTokensAddresses])

  const selectUserTokensBalances = useSelector(
    userBalancesSelectors.selectUserTokenBalance,
  )

  const baseTokenWithBalance: TokenModelBalance | undefined = useMemo(
    () =>
      getTokenWithBalance(
        baseTokenAddress,
        selectUserTokensBalances,
        sortedTokens,
      ),
    [baseTokenAddress, selectUserTokensBalances, sortedTokens],
  )

  const quoteTokenWithBalance: TokenModelBalance | undefined = useMemo(
    () =>
      getTokenWithBalance(
        quoteTokenAddress,
        selectUserTokensBalances,
        sortedTokens,
      ),
    [quoteTokenAddress, selectUserTokensBalances, sortedTokens],
  )

  const quoteTokenOptions = useMemo(
    () =>
      sortedTokens.filter(
        (token) => token.address !== baseTokenWithBalance?.address,
      ),
    [sortedTokens, baseTokenWithBalance?.address],
  )

  return {
    baseToken: baseTokenWithBalance,
    quoteToken: quoteTokenWithBalance,
    sortedTokens,
    quoteTokenOptions,
  }
}
