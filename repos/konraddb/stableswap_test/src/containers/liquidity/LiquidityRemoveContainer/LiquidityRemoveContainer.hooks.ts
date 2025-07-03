import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { BigNumber } from 'ethers'

import { TokenModel } from '@hadouken-project/ui'
import { useDepositTokens } from '@hooks/liquidity/useDepositTokens'
import { userBalancesSelectors } from '@store/balances/selectors/user/balances.selector'
import { chainsSelectors } from '@store/chains/chains.selector'
import { BigDecimal } from '@utils/math'
import { findPANToken, findUSDCToken } from '@utils/token'

import { IPoolTokensHook } from '../LiquidityAddContainer/LiquidityAddContainer.types'
import { messages } from './LiquidityRemoveContainer.constants'

export const usePoolTokens = (): IPoolTokensHook => {
  const params = useParams<{ id: string }>()

  const selectUserPoolBalances = useSelector(
    userBalancesSelectors.selectUserPoolBalances,
  )
  const selectChain = useSelector(chainsSelectors.selectByTokenSymbol)

  const [baseToken, setBaseToken] = useState<TokenModel | undefined>()
  const [baseTokenValue, setBaseTokenValue] = useState<BigNumber | undefined>()
  const [baseTokenMaxAmount, setBaseTokenMaxAmount] = useState<
    BigNumber | undefined
  >()

  const [additionalToken, setAdditionalToken] = useState<
    TokenModel | undefined
  >()
  const [additionalTokenValue, setAdditionalTokenValue] = useState<
    BigNumber | undefined
  >()
  const [additionalTokenMaxAmount, setAdditionalTokenMaxAmount] = useState<
    BigNumber | undefined
  >()

  const depositTokens = useDepositTokens()

  const poolBalances = useMemo(() => {
    return selectUserPoolBalances(params.id)
  }, [params, selectUserPoolBalances])

  const expectedChain = useMemo(() => {
    return selectChain(baseToken?.symbol)
  }, [baseToken, selectChain])

  useEffect(() => {
    if (depositTokens && poolBalances) {
      const foundBasePoolToken = findUSDCToken(depositTokens)
      const foundAdditionalPoolToken = findPANToken(depositTokens)
      if (foundBasePoolToken) {
        setBaseToken(foundBasePoolToken)
        setBaseTokenMaxAmount(
          poolBalances[foundBasePoolToken.address]
            ?.toBigNumber()
            .div(BigNumber.from(10).pow(9)),
        )
      }

      if (foundAdditionalPoolToken) {
        setAdditionalToken(foundAdditionalPoolToken)
        setAdditionalTokenMaxAmount(
          poolBalances[foundAdditionalPoolToken.address]
            ?.toBigNumber()
            .div(BigNumber.from(10).pow(9)),
        )
      }
    }
  }, [depositTokens, poolBalances])

  const poolBalancesWithSymbol = useMemo(() => {
    const balance = baseTokenMaxAmount?.add(
      additionalTokenMaxAmount || BigNumber.from(0),
    )
    return [
      {
        symbol: messages.LPT_LABEL,
        balance: BigDecimal.from(balance || BigNumber.from(0), 18),
      },
    ]
  }, [baseTokenMaxAmount, additionalTokenMaxAmount])

  return {
    baseTokenValue,
    setBaseTokenValue,
    additionalToken,
    additionalTokenMaxAmount,
    additionalTokenValue,
    setAdditionalTokenValue,
    baseToken,
    baseTokenMaxAmount,
    expectedChain,
    depositTokens,
    poolBalancesWithSymbol,
    poolId: params.id,
  }
}
