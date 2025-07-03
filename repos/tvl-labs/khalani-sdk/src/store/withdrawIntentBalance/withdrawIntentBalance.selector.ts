import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

const status = createSelector(
  [selectReducer(StoreKeys.WithdrawIntentBalance)],
  (state) => state.status,
)

const loading = createSelector(
  [selectReducer(StoreKeys.WithdrawIntentBalance)],
  (state) => state.loading,
)

const isInitialized = createSelector(
  [selectReducer(StoreKeys.WithdrawIntentBalance)],
  (state) => state.initialized,
)

const isSigned = createSelector(
  [selectReducer(StoreKeys.WithdrawIntentBalance)],
  (state) => state.signed,
)

const error = createSelector(
  [selectReducer(StoreKeys.WithdrawIntentBalance)],
  (state) => state.error,
)

export const withdrawIntentBalanceSelectors = {
  status,
  loading,
  isInitialized,
  isSigned,
  error,
}
