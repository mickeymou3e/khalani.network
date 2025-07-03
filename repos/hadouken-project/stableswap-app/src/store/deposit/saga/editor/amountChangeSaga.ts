import { call, put, select } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'

import { PoolType } from '../../../../interfaces/pool'
import { userBalancesSelectors } from '../../../balances/selectors/user/balances.selector'
import { poolsModelsSelector } from '../../../pool/selectors/models/pool-model.selector'
import { walletSelectors } from '../../../wallet/wallet.selector'
import { depositSelectors } from '../../deposit.selector'
import { depositActions } from '../../deposit.slice'
import { AmountChangeRequestPayload, IDepositToken } from '../../deposit.types'
import {
  calculatePriceImpact,
  getPoolTotalValue,
  shouldDepositButtonBeDisabled,
} from './utils'

export function* amountChangeSaga(
  action: PayloadAction<AmountChangeRequestPayload>,
): Generator {
  const depositEditor = yield* select(depositSelectors.depositEditor)

  const depositTokens: IDepositToken[] =
    depositEditor.depositTokens.map((token) => {
      if (token.address === action.payload.tokenAddress) {
        return {
          ...token,
          amount: action.payload.amount,
        }
      }
      return {
        ...token,
      }
    }) ?? []

  const tokenBalancesSelector = yield* select(
    userBalancesSelectors.selectUserTokensBalances,
  )

  const depositTokensWithUnwrappedAddresses = depositTokens.map((token) => {
    if (token.isLendingToken) {
      return {
        ...token,
        address: token.unwrappedAddress ?? '',
        id: token.unwrappedAddress ?? '',
      }
    }
    return token
  })

  const tokenBalances = tokenBalancesSelector(
    depositTokensWithUnwrappedAddresses.map((token) => token.address),
  )

  const totalDepositValueUSD = yield* call(getPoolTotalValue, depositTokens)

  const poolId = depositEditor.poolId ?? ''
  const poolModelSelector = yield* select(poolsModelsSelector.selectById)
  const poolModel = poolModelSelector(poolId)

  const poolType = poolModel?.pool.poolType

  const userAddress = yield* select(walletSelectors.userAddress)
  const buttonDisabled = shouldDepositButtonBeDisabled(
    depositTokensWithUnwrappedAddresses,
    tokenBalances,
  )

  const priceImpact = yield* call(
    calculatePriceImpact,
    depositTokensWithUnwrappedAddresses,
    depositEditor.poolId ?? '',
    userAddress ?? '',
    poolType,
  )

  const proportionalCalculationForToken =
    poolType === PoolType.Weighted && action.payload.amount?.gt(0)
      ? action.payload.tokenAddress
      : null

  yield* put(
    depositActions.amountChangeSuccess({
      totalDepositValueUSD,
      buttonDisabled,
      priceImpact,
      proportionalCalculationForToken,
      depositTokens,
    }),
  )
}
