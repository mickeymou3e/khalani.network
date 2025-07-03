import { RequestStatus } from '@constants/Request'
import { IReserve } from '@interfaces/tokens'
import {
  PayloadAction,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { IReservesSagaState } from './reserves.types'

export const reservesAdapter = createEntityAdapter<IReserve>()

const initReservesSliceState = reservesAdapter.getInitialState<IReservesSagaState>(
  {
    status: RequestStatus.Idle,
  },
)

export const ReservesSlice = createSlice({
  initialState: initReservesSliceState,
  name: StoreKeys.Reserves,
  reducers: {
    fetchReservesRequest: (state) => {
      state.status = RequestStatus.Pending
    },
    fetchReservesSuccess: (state, action: PayloadAction<IReserve[]>) => {
      state.status = RequestStatus.Resolved
      reservesAdapter.setAll(state, action.payload)
      return state
    },
    fetchReservesFailure: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
    resetReserves: (state) => {
      state.status = RequestStatus.Idle

      reservesAdapter.removeAll(state)

      return state
    },
  },
})

export const reservesActions = ReservesSlice.actions
export const reservesReducer = ReservesSlice.reducer
