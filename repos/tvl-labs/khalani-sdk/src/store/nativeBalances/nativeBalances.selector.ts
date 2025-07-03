import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

import { nativeBalancesAdapter } from './nativeBalances.slice'

const selectById = createSelector(
  [selectReducer(StoreKeys.NativeBalances)],
  (state) => (id: string) =>
    nativeBalancesAdapter.getSelectors().selectById(state, id),
)

const selectAll = createSelector(
  [selectReducer(StoreKeys.NativeBalances)],
  (state) => nativeBalancesAdapter.getSelectors().selectAll(state),
)

export const nativeBalancesSelectors = {
  selectById,
  selectAll,
}
