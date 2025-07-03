import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { BigNumber } from 'ethers'

import { PAN } from '@dataSource/graph/pools/poolsTokens/constants'
import { TokenModel } from '@hadouken-project/ui'
import { useDepositTokens } from '@hooks/liquidity/useDepositTokens'
import { ITokenWithBalance } from '@interfaces/token'
import { userBalancesSelectors } from '@store/balances/selectors/user/balances.selector'
import { chainsSelectors } from '@store/chains/chains.selector'
import { khalaBalancesSelectors } from '@store/khala/balances/balances.selector'
import { khalaTokenSelectors } from '@store/khala/tokens/tokens.selector'
import { findUSDCToken } from '@utils/token'

import {
  IPoolBalancesWithSymbol,
  IPoolTokensHook,
} from './LiquidityAddContainer.types'

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

  const allTokens = useSelector(khalaTokenSelectors.selectAll)
  const selectBalanceById = useSelector(khalaBalancesSelectors.selectById)

  useEffect(() => {
    if (allTokens && depositTokens) {
      const foundPoolToken = findUSDCToken(depositTokens)
      const foundBaseToken = allTokens.find(
        (token) => token.symbol === foundPoolToken?.symbol,
      )
      const foundAdditionalToken = allTokens.find(
        (token) =>
          token.chainId === foundBaseToken?.chainId &&
          token.symbol.includes(PAN.symbol),
      )
      setBaseToken(foundBaseToken)
      setAdditionalToken(foundAdditionalToken)
    }
  }, [depositTokens, allTokens])

  useEffect(() => {
    if (baseToken && additionalToken) {
      const baseTokenBalance = selectBalanceById(baseToken.id)
      const additionalTokenBalance = selectBalanceById(additionalToken.id)
      setBaseTokenMaxAmount(baseTokenBalance?.balance)
      setAdditionalTokenMaxAmount(additionalTokenBalance?.balance)
    }
  }, [selectBalanceById, baseToken, additionalToken])

  const expectedChain = useMemo(() => selectChain(baseToken?.symbol), [
    selectChain,
    baseToken,
  ])

  const poolBalancesWithSymbol = useMemo(() => {
    const poolBalances = selectUserPoolBalances(params.id)
    const poolBalancesWithSymbol: IPoolBalancesWithSymbol[] = []
    const foundDepositTokens: (ITokenWithBalance | undefined)[] = []
    if (poolBalances) {
      const foundBaseToken = depositTokens?.find(
        (depositToken) => depositToken.symbol === baseToken?.symbol,
      )
      const foundAdditionalToken = depositTokens?.find(
        (depositToken) => depositToken.symbol === additionalToken?.symbol,
      )
      foundDepositTokens.push(foundBaseToken, foundAdditionalToken)
      if (foundDepositTokens) {
        foundDepositTokens.map((token) => {
          if (token) {
            poolBalancesWithSymbol.push({
              symbol: token.symbol,
              balance: poolBalances[token.address],
            })
          }
        })
      }
    }
    return poolBalancesWithSymbol
  }, [
    selectUserPoolBalances,
    params,
    baseToken,
    depositTokens,
    additionalToken,
  ])

  return {
    baseTokenValue,
    setBaseTokenValue,
    additionalToken,
    additionalTokenMaxAmount,
    additionalTokenValue,
    setAdditionalTokenValue,
    baseToken,
    baseTokenMaxAmount,
    poolBalancesWithSymbol,
    expectedChain,
    depositTokens,
    poolId: params.id,
  }
}
