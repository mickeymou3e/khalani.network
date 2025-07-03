import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

const approvalTokens = createSelector(
  [selectReducer(StoreKeys.Approve)],
  (reducerState) => reducerState.approvalTokens,
)

const approveLoading = createSelector(
  [selectReducer(StoreKeys.Approve)],
  (reducerState) => reducerState?.loading,
)

export const approveSelectors = {
  approvalTokens,
  approveLoading,
}
