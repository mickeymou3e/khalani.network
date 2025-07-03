import { IJoinExit } from '@dataSource/graph/pools/poolLiquidity/types'
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

import {
  ILiquidityProvisionSuccess,
  IPoolJoinsExitsPayload,
} from './poolJoinsExits.types'

export const myLiquidityAdapter = createEntityAdapter<IJoinExit>()

export const allLiquidityAdapter = createEntityAdapter<IJoinExit>()

const initialState = {
  isFetching: false,
  myLiquidity: myLiquidityAdapter.getInitialState(),
  allLiquidity: allLiquidityAdapter.getInitialState(),
  hasMore: {
    allLiquidity: true,
    myLiquidity: true,
  },
}

export const poolJoinsExitsSlice = createSlice({
  initialState,
  name: StoreKeys.PoolJoinsExits,
  reducers: {
    fetchPoolJoinsExitsRequest: (
      state,
      _action: PayloadAction<IPoolJoinsExitsPayload>,
    ) => {
      state.isFetching = true

      return state
    },
    fetchPoolJoinsExitsInitializeSuccess: (
      state,
      action: PayloadAction<ILiquidityProvisionSuccess>,
    ) => {
      myLiquidityAdapter.setAll(state.myLiquidity, action.payload.myLiquidity)

      allLiquidityAdapter.setAll(
        state.allLiquidity,
        action.payload.allLiquidity,
      )

      state.hasMore = { ...state.hasMore, ...action.payload.hasMore }

      state.isFetching = false

      return state
    },
    fetchPoolJoinsExitsInitializeError: (state) => {
      allLiquidityAdapter.removeAll(state.allLiquidity)
      myLiquidityAdapter.removeAll(state.myLiquidity)

      state.isFetching = false

      return state
    },

    loadMorePoolJoinExitsSuccess: (
      state,
      action: PayloadAction<ILiquidityProvisionSuccess>,
    ) => {
      myLiquidityAdapter.upsertMany(
        state.myLiquidity,
        action.payload.myLiquidity,
      )

      allLiquidityAdapter.upsertMany(
        state.allLiquidity,
        action.payload.allLiquidity,
      )

      state.hasMore = {
        ...state.hasMore,
        ...action.payload.hasMore,
      }

      state.isFetching = false

      return state
    },
    loadMoreJoinExitsError: (state) => {
      state.isFetching = false

      return state
    },
  },
})

export const poolJoinsExitsActions = poolJoinsExitsSlice.actions
export const poolJoinsExitsReducer = poolJoinsExitsSlice.reducer
