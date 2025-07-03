import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { ITokenBalancesAcrossChains } from '@tvl-labs/khalani-ui/dist/interfaces/balances'
import {
  balancesSelectors,
  getDepositDestinationChain,
  IPrice,
  nativeBalancesSelectors,
  pricesSelector,
} from '@tvl-labs/sdk'

import { IUseTokenBalancesAcrossChainsHook } from './HeaderContainer.types'

export const useTokenBalancesAcrossChains = (): IUseTokenBalancesAcrossChainsHook => {
  const [tokenBalancesAcrossChains, setTokenBalancesAcrossChains] = useState<
    ITokenBalancesAcrossChains[] | undefined
  >()
  const khalaBalances = useSelector(balancesSelectors.selectAll)
  const prices = useSelector(pricesSelector.selectAll)
  const nativeBalances = useSelector(nativeBalancesSelectors.selectAll)

  const isFetchingBalances =
    khalaBalances.length === 0 ||
    prices.length === 0 ||
    nativeBalances.length === 0

  useEffect(() => {
    const tokenBalancesAcrossChains: ITokenBalancesAcrossChains[] = []
    const concatedBalances = khalaBalances.concat(nativeBalances)
    concatedBalances.map((balance) => {
      const moreThanZero = balance.balance > BigInt(0)
      const isKhalaChain = balance.chainId === getDepositDestinationChain()
      if (!moreThanZero || isKhalaChain) return
      const isElem = tokenBalancesAcrossChains.some(
        (item) => item.tokenSymbol === balance.tokenSymbol,
      )
      if (!isElem) {
        tokenBalancesAcrossChains.push({
          tokenId: balance.id,
          tokenSymbol: balance.tokenSymbol,
          tokenDecimals: balance.decimals,
          balances: [
            {
              chainId: parseInt(balance.chainId),
              value: balance.balance,
            },
          ],
        })
      } else {
        const foundElem = tokenBalancesAcrossChains.find(
          (item) => item.tokenSymbol === balance.tokenSymbol,
        )
        if (foundElem) {
          foundElem.balances.push({
            chainId: parseInt(balance.chainId),
            value: balance.balance,
          })
        }
      }
    })
    calculateSummedValues(tokenBalancesAcrossChains, prices)
    setTokenBalancesAcrossChains(tokenBalancesAcrossChains)
  }, [khalaBalances, prices, nativeBalances])

  const calculateSummedValues = (
    tokenBalancesAcrossChains: ITokenBalancesAcrossChains[],
    prices: IPrice[],
  ) => {
    return tokenBalancesAcrossChains?.map((tokenBalance) => {
      const tokenPrice = prices.find(
        (price) =>
          price.id.toLowerCase() === tokenBalance.tokenId.toLowerCase(),
      )
      if (!tokenPrice) return
      const summedBalance = tokenBalance.balances.reduce(
        (a, b) => a + b.value,
        BigInt(0),
      )

      const summedBalanceUSD = summedBalance * tokenPrice.price.toBigInt()
      tokenBalance.summedBalance = summedBalance
      tokenBalance.summedBalanceUSD = summedBalanceUSD
      return tokenBalance
    })
  }

  const accountBalance = useMemo(() => {
    if (tokenBalancesAcrossChains?.length === 0) return
    return tokenBalancesAcrossChains?.reduce((a, b) => {
      if (!b.summedBalanceUSD) return
      return (
        a +
        (b.tokenDecimals === 6
          ? b.summedBalanceUSD
          : b.summedBalanceUSD / BigInt(10) ** BigInt(12))
      )
    }, BigInt(0))
  }, [tokenBalancesAcrossChains])

  return { tokenBalancesAcrossChains, accountBalance, isFetchingBalances }
}
