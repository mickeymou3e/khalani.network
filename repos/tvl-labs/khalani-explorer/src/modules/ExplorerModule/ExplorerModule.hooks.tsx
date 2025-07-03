import { useCallback, useEffect, useRef, useState } from 'react'

import { BigNumber } from 'ethers'

import { getSwapIntentBooks } from '@pages/Explorer/intents'
import { SwapIntentBook } from '@pages/Explorer/intents/types'
import { formatWithCommas } from '@tvl-labs/khalani-ui'

import config from '../../config'

const khalaTokens = config.tokens

export function useExplorerHooks() {
  const [transactions, setTransactions] = useState<SwapIntentBook[]>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const mountedRef = useRef(true)

  const getTokensWithAmounts = useCallback(
    (
      tokensAddresses: string[],
      amounts: string[],
    ): { symbol: string; amount: string }[] => {
      return tokensAddresses
        .map((tokenAddress, index) => {
          const token = khalaTokens.find(
            (i) => i.address.toLowerCase() === tokenAddress.toLowerCase(),
          )

          if (!token) {
            return
          }

          const amount = BigNumber.from(amounts[index])

          if (amount.gt(BigNumber.from(0))) {
            return {
              symbol: token.symbol,
              amount: formatWithCommas(
                BigNumber.from(amounts[index]),
                token.decimals,
              ),
            }
          }

          return null
        })
        .filter((i) => i) as { symbol: string; amount: string }[]
    },
    [],
  )

  const fetchLastTransactions = useCallback(async function () {
    setTransactions([])
    const transactions = await getSwapIntentBooks()

    const sortedTransactions = transactions.sort((a, b) => {
      const aTimestamp = parseInt(a.blockTimestamp || '0', 10)
      const bTimestamp = parseInt(b.blockTimestamp || '0', 10)
      if (aTimestamp < bTimestamp) {
        return 1
      }
      if (aTimestamp > bTimestamp) {
        return -1
      }

      return 0
    })
    setTransactions(sortedTransactions)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!mountedRef.current) return
    fetchLastTransactions()
    return () => {
      mountedRef.current = false
    }
  }, [fetchLastTransactions])

  return {
    getTokensWithAmounts,
    transactions,
    isLoading,
  }
}
