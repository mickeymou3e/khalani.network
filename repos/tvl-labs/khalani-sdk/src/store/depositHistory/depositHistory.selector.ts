import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

const selectAll = createSelector(
  [selectReducer(StoreKeys.DepositHistory)],
  (state) => state.history,
)

const isLoading = createSelector(
  [selectReducer(StoreKeys.DepositHistory)],
  (state) => state.isFetching,
)

const isInitialized = createSelector(
  [selectReducer(StoreKeys.DepositHistory)],
  (state) => state.isInitialized,
)

const deposits = createSelector(
  [selectReducer(StoreKeys.DepositHistory)],
  (state) => state.history,
)

export const depositHistorySelectors = {
  isLoading,
  isInitialized,
  selectAll,
  deposits,
}
