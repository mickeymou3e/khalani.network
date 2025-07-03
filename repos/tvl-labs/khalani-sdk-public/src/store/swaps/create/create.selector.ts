import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

const intent = createSelector(
  [selectReducer(StoreKeys.CreateIntent)],
  (state) => state.intent,
)

const isInitialized = createSelector(
  [selectReducer(StoreKeys.CreateIntent)],
  (state) => state.initialized,
)

const isSigned = createSelector(
  [selectReducer(StoreKeys.CreateIntent)],
  (state) => state.signed,
)

const error = createSelector(
  [selectReducer(StoreKeys.CreateIntent)],
  (state) => state.error,
)

export const createIntentSelectors = {
  intent,
  isInitialized,
  isSigned,
  error,
}
