import { StrictEffect } from 'redux-saga/effects'
import { select, call } from 'typed-redux-saga'

import { waitForUserShareBeFetched } from '@store/deposit/saga/editor/utils'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { userSharesSelectors } from '@store/userShares/userShares.selector'
import { TokenBalances } from '@store/userShares/userShares.types'
import { withdrawSelectors } from '@store/withdraw/withdraw.selector'
import { IWithdrawRequest, IWithdrawType } from '@store/withdraw/withdraw.types'
import { BigDecimal, SLIPPAGE_DECIMALS } from '@utils/math'

import { calculateWithdrawPreviewSaga } from '../calculateWithdrawPreview.saga'

export function* calculateComposablePoolProportional(
  poolId: string,
  percentage: number,
): Generator<StrictEffect, TokenBalances> {
  try {
    yield* call(waitForUserShareBeFetched)

    const selectPoolById = yield* select(poolSelectors.selectById)
    const poolModelSelector = yield* select(poolsModelsSelector.selectById)

    const pool = selectPoolById(poolId)
    const poolModel = poolModelSelector(poolId)

    if (!pool) throw Error('Pool not found')
    if (!poolModel) throw Error('Pool Model not found')

    const userShareSelector = yield* select(
      userSharesSelectors.selectUserPoolShare,
    )

    const userLpTokenBalance = userShareSelector(poolId) ?? BigDecimal.from(0)

    const proportionalUserLpTokenBalance = userLpTokenBalance.mul(
      BigDecimal.from(percentage, 2),
    )

    const { withdrawTokens } = yield* select(withdrawSelectors.withdrawEditor)

    const data: IWithdrawRequest = {
      inToken: pool.address,
      inTokenAmount: proportionalUserLpTokenBalance,
      outTokens: withdrawTokens.map((token) => token.address),
      outTokensAmounts: [],
      type: IWithdrawType.ExactIn,
      poolId: pool.id,
      slippage: BigDecimal.from(0, SLIPPAGE_DECIMALS),
      isMaxAmount: false,
      tokenIndex: null,
    }

    const withdrawPreview = yield* call(calculateWithdrawPreviewSaga, data)

    const balances = withdrawPreview.outTokens.reduce<TokenBalances>(
      (previousData, data, index) => {
        return {
          ...previousData,
          [data]: withdrawPreview.outTokensAmounts[index],
        }
      },
      {},
    )

    return balances
  } catch {
    return {}
  }
}
