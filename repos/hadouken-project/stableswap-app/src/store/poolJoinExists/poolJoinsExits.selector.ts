import { LiquidityToggle } from '@containers/pools/PoolLiquidity/PoolLiquidity.types'
import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

import { allLiquidityAdapter, myLiquidityAdapter } from './poolJoinsExits.slice'

const selectAll = createSelector(
  selectReducer(StoreKeys.PoolJoinsExits),
  (state) => {
    return (selectedToggle: LiquidityToggle) => {
      if (selectedToggle === LiquidityToggle.MyLiquidity) {
        return myLiquidityAdapter.getSelectors().selectAll(state.myLiquidity)
      }

      return allLiquidityAdapter.getSelectors().selectAll(state.allLiquidity)
    }
  },
)

const selectPoolJoinsExitsLoading = createSelector(
  selectReducer(StoreKeys.PoolJoinsExits),
  (reducerState) => reducerState.isFetching,
)

const selectHasMore = createSelector(
  selectReducer(StoreKeys.PoolJoinsExits),
  (state) => {
    return (selectedToggle: LiquidityToggle) => {
      if (selectedToggle === LiquidityToggle.MyLiquidity) {
        return state.hasMore.myLiquidity
      }

      return state.hasMore.allLiquidity
    }
  },
)

export const poolJoinsExitsSelectors = {
  selectAll,
  selectHasMore,
  selectPoolJoinsExitsLoading,
}
