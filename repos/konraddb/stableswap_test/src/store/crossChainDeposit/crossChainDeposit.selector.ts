import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

import { ICrossChainDeposit } from './crossChainDeposit.types'

const deposit = createSelector(
  [selectReducer(StoreKeys.CrossChainDeposit)],
  (reducerState) =>
    ({
      poolId: reducerState?.poolId,

      inTokens: reducerState?.inTokens,
      inTokensAmounts: reducerState?.inTokensAmounts,

      slippage: reducerState?.slippage,
      outToken: reducerState?.outToken,
      outTokenAmounts: reducerState?.outTokenAmounts,
    } as ICrossChainDeposit),
)

const depositReady = createSelector(
  [selectReducer(StoreKeys.CrossChainDeposit)],
  (reduceState) => !!reduceState,
)

const depositLoading = createSelector(
  [selectReducer(StoreKeys.CrossChainDeposit)],
  (reducerState) => reducerState?.loading,
)

export const crossChainDepositSelectors = {
  deposit,
  depositReady,
  depositLoading,
}
