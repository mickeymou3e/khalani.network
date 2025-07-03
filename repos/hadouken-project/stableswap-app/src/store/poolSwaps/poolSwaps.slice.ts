import { ISwap } from '@dataSource/graph/pools/poolsSwaps/types'
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

import { IPoolSwaps, IPoolSwapsPayload } from './poolSwaps.types'

export const poolSwapsAdapter = createEntityAdapter<ISwap>()

const initialState = {
  isFetching: false,
  swaps: poolSwapsAdapter.getInitialState(),
  hasMore: true,
}

export const poolSwapsSlice = createSlice({
  initialState,
  name: StoreKeys.PoolSwaps,
  reducers: {
    fetchPoolSwapsRequest: (
      state,
      _action: PayloadAction<IPoolSwapsPayload>,
    ) => {
      state.isFetching = true

      return state
    },
    fetchPoolSwapsInitializeSuccess: (
      state,
      action: PayloadAction<IPoolSwaps>,
    ) => {
      poolSwapsAdapter.setAll(state.swaps, action.payload.swaps)

      state.hasMore = action.payload.hasMore

      state.isFetching = false

      return state
    },
    fetchPoolSwapsInitializeError: (state) => {
      poolSwapsAdapter.removeAll(state.swaps)

      state.isFetching = false

      return state
    },
    loadMorePoolSwapsSuccess: (state, action: PayloadAction<IPoolSwaps>) => {
      poolSwapsAdapter.upsertMany(state.swaps, action.payload.swaps)

      state.hasMore = action.payload.hasMore

      state.isFetching = false

      return state
    },
    loadMorePoolSwapsError: (state) => {
      state.isFetching = false

      return state
    },
  },
})

export const poolSwapsActions = poolSwapsSlice.actions
export const poolSwapsReducer = poolSwapsSlice.reducer
