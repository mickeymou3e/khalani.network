import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

const status = createSelector(
  [selectReducer(StoreKeys.WithdrawMToken)],
  (state) => state.status,
)

const loading = createSelector(
  [selectReducer(StoreKeys.WithdrawMToken)],
  (state) => state.loading,
)

const isInitialized = createSelector(
  [selectReducer(StoreKeys.WithdrawMToken)],
  (state) => state.initialized,
)

const isSigned = createSelector(
  [selectReducer(StoreKeys.WithdrawMToken)],
  (state) => state.signed,
)

const error = createSelector(
  [selectReducer(StoreKeys.WithdrawMToken)],
  (state) => state.error,
)

export const withdrawMTokenSelectors = {
  status,
  loading,
  isInitialized,
  isSigned,
  error,
}
