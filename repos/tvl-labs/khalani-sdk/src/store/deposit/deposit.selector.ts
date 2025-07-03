import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

const params = createSelector(
  [selectReducer(StoreKeys.Deposit)],
  (state) => state.params,
)

const isLoading = createSelector(
  [selectReducer(StoreKeys.Deposit)],
  (state) => state.loading,
)

const isInitialized = createSelector(
  [selectReducer(StoreKeys.Deposit)],
  (state) => state.initialized,
)

const error = createSelector(
  [selectReducer(StoreKeys.Deposit)],
  (state) => state.error,
)

export const depositSelectors = {
  params,
  isLoading,
  isInitialized,
  error,
}
