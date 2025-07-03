import { RequestStatus } from '@constants/Request'
import { IPool } from '@interfaces/pool'
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { IPoolsSagaState } from './pool.types'

export const poolsAdapter = createEntityAdapter<IPool>()

const initPoolsSliceState = poolsAdapter.getInitialState<IPoolsSagaState>({
  status: RequestStatus.Idle,
  isFetching: false,
})

export const poolsSlice = createSlice({
  initialState: initPoolsSliceState,
  name: StoreKeys.Pools,
  reducers: {
    updateRequest: (state) => {
      state.isFetching = true
      state.status = RequestStatus.Pending
      return state
    },
    updateSuccess: (state, action: PayloadAction<IPool[]>) => {
      const pools = action.payload
      state.isFetching = false
      state.status = RequestStatus.Resolved
      poolsAdapter.upsertMany(state, pools)
      return state
    },
    updateError: (state) => {
      state.isFetching = false
      state.status = RequestStatus.Rejected
      return state
    },
  },
})

export const poolsActions = poolsSlice.actions
export const poolsReducer = poolsSlice.reducer
