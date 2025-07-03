import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { PoolTokenBalance } from '@interfaces/token'
import { userBalancesSelectors } from '@store/balances/selectors/user/balances.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { BigDecimal } from '@utils/math'

export const useTokenWithBalances = (): {
  tokens: PoolTokenBalance[]
} => {
  const [tokensWithBalance, setTokensWithBalance] = useState<
    PoolTokenBalance[]
  >([])

  const tokens = useSelector(tokenSelectors.selectTokens)

  const selectUserTokensBalances = useSelector(
    userBalancesSelectors.selectUserTokensBalances,
  )
  useEffect(() => {
    const tokensIds = tokens
      .filter(({ isLpToken }) => !isLpToken)
      .map(({ id }) => id)
    const tokensBalances = selectUserTokensBalances(tokensIds)

    const tokensWithBalance = tokens
      .filter(({ isLpToken }) => !isLpToken)
      .map((token) => {
        const balanceId = tokensBalances
          ? Object.keys(tokensBalances).find((tokenId) => tokenId === token.id)
          : null

        const balance =
          balanceId && tokensBalances ? tokensBalances[balanceId] : null

        return {
          ...token,
          balance: balance ? balance : BigDecimal.from(0),
        } as PoolTokenBalance
      })

    setTokensWithBalance(tokensWithBalance)
  }, [tokens, selectUserTokensBalances])

  return {
    tokens: tokensWithBalance,
  }
}
