import { call, put, select } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { getPoolDepositTokens } from '@store/deposit/saga/editor/utils'
import { networkSelectors } from '@store/network/network.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { BigDecimal } from '@utils/math'

import { withdrawSelectors } from '../withdraw.selector'
import { withdrawActions } from '../withdraw.slice'
import { calculateComposablePoolProportional } from './composablePool/calculateComposablePoolProportional.saga'
import { getProportionalToken } from './getProportionalToken'
import { amountChangeSaga } from './withdrawAmountChange.saga'
import { withdrawSingleTokenMax } from './withdrawSingleTokenMax'

export function* wrappedTokensChange(
  action: PayloadAction<boolean>,
): Generator {
  const { poolId, percentage, userMaxLpTokenBalance } = yield* select(
    withdrawSelectors.withdrawEditor,
  )

  const selectPoolModel = yield* select(poolsModelsSelector.selectById)
  const chainId = yield* select(networkSelectors.applicationChainId)

  const poolModel = selectPoolModel(poolId ?? '')

  yield* call(
    amountChangeSaga,
    withdrawActions.amountChangeRequest(BigDecimal.from(0)),
  )

  if (poolModel && poolId) {
    const tokens = yield* call(
      getPoolDepositTokens,
      poolModel,
      chainId,
      action.payload,
    )

    const proportionalToken = yield* call(getProportionalToken, tokens)

    yield* put(
      withdrawActions.setWithdrawTokens({
        withdrawTokens: tokens,
        proportionalToken,
      }),
    )

    yield* put(withdrawActions.setSelectedToken(proportionalToken))

    const wrappedTokensAmountMax = yield* call(
      withdrawSingleTokenMax,
      withdrawActions.withdrawSingleTokenMaxRequest({
        outTokens: tokens.map(({ address }) => address),
        poolId: poolModel.pool.id,
        tokenInAddress: poolModel.pool.address,
        tokenInAmount: userMaxLpTokenBalance,
      }),
    )

    yield* put(
      withdrawActions.withdrawSingleTokenRequestUpdate(wrappedTokensAmountMax),
    )

    const balances = yield* call(
      calculateComposablePoolProportional,
      poolId,
      percentage,
    )

    yield* put(
      withdrawActions.wrappedTokenChangeSuccess({ balances, percentage }),
    )
  }
}
