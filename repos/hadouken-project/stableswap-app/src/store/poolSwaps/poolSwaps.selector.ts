import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

import { poolSwapsAdapter } from './poolSwaps.slice'

const selectAll = createSelector(
  selectReducer(StoreKeys.PoolSwaps),
  (state) => {
    const swaps = poolSwapsAdapter.getSelectors().selectAll(state.swaps)

    return swaps
  },
)

const selectHasMore = createSelector(
  selectReducer(StoreKeys.PoolSwaps),
  (state) => state.hasMore,
)

const selectPoolSwapsLoading = createSelector(
  selectReducer(StoreKeys.PoolSwaps),
  (reducerState) => reducerState.isFetching,
)

export const poolSwapsSelectors = {
  selectAll,
  selectPoolSwapsLoading,
  selectHasMore,
}
