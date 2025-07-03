import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

const selectAll = createSelector(
  [selectReducer(StoreKeys.IntentBalances)],
  (state) => state.intentBalances,
)

export const intentBalancesSelectors = {
  selectAll,
}
