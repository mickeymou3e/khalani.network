import { call, put, select } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'

import { BigDecimal } from '../../../../utils/math'
import { userBalancesSelectors } from '../../../balances/selectors/user/balances.selector'
import { walletSelectors } from '../../../wallet/wallet.selector'
import { depositSelectors } from '../../deposit.selector'
import { depositActions } from '../../deposit.slice'
import {
  calculatePriceImpact,
  calculateProportionalDepositAmounts,
} from './utils'

export function* proportionalSuggestionSaga(
  action: PayloadAction<string>,
): Generator {
  try {
    const userAddress = yield* select(walletSelectors.userAddress)
    const userTokenBalancesSelector = yield* select(
      userBalancesSelectors.selectUserTokensBalances,
    )

    const depositEditor = yield* select(depositSelectors.depositEditor)
    const currentToken = depositEditor.depositTokens.find(
      (token) => token.address === action.payload,
    )

    const poolId = depositEditor.poolId

    const selectPoolModel = yield* select(poolsModelsSelector.selectById)

    const poolModel = selectPoolModel(poolId ?? '')

    if (!poolModel) throw new Error("PoolModel doesn't exist")

    if (currentToken && currentToken.amount) {
      const balances = userTokenBalancesSelector(
        depositEditor.depositTokens.map((token) => token.address),
      )

      const tokenWithBalances = depositEditor.depositTokens.map((token) => {
        const balance = balances?.[token.address] ?? BigDecimal.from(0)
        return {
          address: token.address,
          balance: balance,
          decimals: token.decimals,
        }
      })

      const depositAmounts = calculateProportionalDepositAmounts(
        currentToken,
        balances?.[currentToken.address] ?? BigDecimal.from(0),
        tokenWithBalances,
        poolModel,
      )

      const depositTokensWithNewAmounts = depositEditor.depositTokens.map(
        (depositToken) => {
          const depositAmount = depositAmounts.find(
            (token) => token.address === depositToken.address,
          )
          if (depositAmount) {
            return {
              ...depositToken,
              amount: depositAmount.amount,
            }
          }

          return depositToken
        },
      )

      const priceImpact = yield* call(
        calculatePriceImpact,
        depositTokensWithNewAmounts,
        depositEditor.poolId ?? '',
        userAddress ?? '',
        depositEditor.poolType ?? undefined,
      )

      yield* put(
        depositActions.proportionalSuggestionSuccess({
          depositTokens: depositTokensWithNewAmounts,
          priceImpact: priceImpact,
        }),
      )
    }
  } catch (e) {
    console.error(e)
  }
}
