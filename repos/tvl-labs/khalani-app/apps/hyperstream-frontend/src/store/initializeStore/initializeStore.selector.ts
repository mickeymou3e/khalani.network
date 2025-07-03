import { createSelector } from '@reduxjs/toolkit'
import { RequestStatus } from '@tvl-labs/sdk'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

const isInitialized = createSelector(
  [selectReducer(StoreKeys.InitializeStore)],
  (reducerState) =>
    reducerState.status === RequestStatus.Rejected ||
    reducerState.status === RequestStatus.Resolved,
)

export const initializeStoreSelectors = {
  isInitialized,
}
