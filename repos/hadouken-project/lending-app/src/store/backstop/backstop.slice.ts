import { IBackstopPool } from '@interfaces/data'
import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'

export const backstopAdapter = createEntityAdapter<IBackstopPool>()

const initBackstopSliceState = backstopAdapter.getInitialState<{
  isFetching: boolean
}>({ isFetching: true })

export const backstopSlice = createSlice({
  initialState: initBackstopSliceState,
  name: StoreKeys.Backstop,
  reducers: {
    fetchBackstopPoolsRequest: (state) => {
      state.isFetching = true
      return state
    },
    fetchBackstopPoolsSuccess: (
      state,
      action: PayloadAction<IBackstopPool[]>,
    ) => {
      state.isFetching = false
      backstopAdapter.setAll(state, action.payload)
      return state
    },
    fetchBackstopPoolsFailure: (state) => {
      state.isFetching = false
      return state
    },
  },
})

export const backstopActions = backstopSlice.actions
export const backstopReducer = backstopSlice.reducer
