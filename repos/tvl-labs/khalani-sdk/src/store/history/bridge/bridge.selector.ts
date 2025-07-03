import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

const selectAll = createSelector(
  [selectReducer(StoreKeys.BridgeHistory)],
  (state) => state.bridgeHistory,
)

export const bridgeHistorySelectors = {
  selectAll,
}
