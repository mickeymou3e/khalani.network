import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

const input = createSelector(
  [selectReducer(StoreKeys.CreateRefine)],
  (state) => state.input,
)

const isLoading = createSelector(
  [selectReducer(StoreKeys.CreateRefine)],
  (state) => state.loading,
)

const output = createSelector(
  [selectReducer(StoreKeys.CreateRefine)],
  (state) => state.output,
)

export const createRefineSelectors = {
  input,
  isLoading,
  output,
}
