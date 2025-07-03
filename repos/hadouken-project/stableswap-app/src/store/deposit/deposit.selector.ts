import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

const depositReady = createSelector(
  [selectReducer(StoreKeys.Deposit)],
  (reduceState) => !!reduceState,
)

const depositLoading = createSelector(
  [selectReducer(StoreKeys.Deposit)],
  (reducerState) => reducerState?.isLoadingPreview,
)

const depositInProgress = createSelector(
  [selectReducer(StoreKeys.Deposit)],
  (reducerState) => reducerState?.depositInProgress,
)

const depositEditor = createSelector(
  [selectReducer(StoreKeys.Deposit)],
  (reducerState) => reducerState,
)

const depositTokens = createSelector(
  [selectReducer(StoreKeys.Deposit)],
  (reducerState) => [...reducerState.depositTokens],
)

export const depositSelectors = {
  depositReady,
  depositLoading,
  depositInProgress,

  depositEditor,
  depositTokens,
}
