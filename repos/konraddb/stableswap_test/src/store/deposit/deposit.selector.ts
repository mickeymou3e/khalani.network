import { createSelector } from '@reduxjs/toolkit'
import { IDeposit } from '@store/deposit/deposit.types'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

const deposit = createSelector(
  [selectReducer(StoreKeys.Deposit)],
  (reducerState) =>
    ({
      poolId: reducerState?.poolId,

      inTokens: reducerState?.inTokens,
      inTokensAmounts: reducerState?.inTokensAmounts,

      slippage: reducerState?.slippage,
      outToken: reducerState?.outToken,
      outTokenAmounts: reducerState?.outTokenAmounts,
    } as IDeposit),
)

const depositReady = createSelector(
  [selectReducer(StoreKeys.Deposit)],
  (reduceState) => !!reduceState,
)

const depositLoading = createSelector(
  [selectReducer(StoreKeys.Deposit)],
  (reducerState) => reducerState?.loading,
)

export const depositSelectors = {
  deposit,
  depositReady,
  depositLoading,
}
