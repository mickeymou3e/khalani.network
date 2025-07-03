import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'
import { IWithdraw } from '@store/withdraw/withdraw.types'

const withdraw = createSelector(
  [selectReducer(StoreKeys.Withdraw)],
  (reducerState) =>
    ({
      poolId: reducerState?.poolId,

      inToken: reducerState?.inToken,
      inTokenAmount: reducerState?.inTokenAmount,

      outTokens: reducerState?.outTokens,
      outTokensAmounts: reducerState?.outTokensAmounts,

      type: reducerState?.type,

      slippage: reducerState?.slippage,
    } as IWithdraw),
)

const withdrawReady = createSelector(
  [selectReducer(StoreKeys.Withdraw)],
  (reduceState) => !!reduceState,
)

const withdrawLoading = createSelector(
  [selectReducer(StoreKeys.Withdraw)],
  (reducerState) => reducerState?.loading,
)

export const withdrawSelectors = {
  withdraw,
  withdrawReady,
  withdrawLoading,
}
