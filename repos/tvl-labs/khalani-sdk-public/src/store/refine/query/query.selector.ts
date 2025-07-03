import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

const input = createSelector(
  [selectReducer(StoreKeys.QueryRefine)],
  (state) => state.input,
)

const isLoading = createSelector(
  [selectReducer(StoreKeys.QueryRefine)],
  (state) => state.loading,
)

const output = createSelector(
  [selectReducer(StoreKeys.QueryRefine)],
  (state) => state.output,
)

export const queryRefineSelectors = {
  input,
  isLoading,
  output,
}
