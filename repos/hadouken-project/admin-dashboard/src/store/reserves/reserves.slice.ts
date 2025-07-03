import { RequestStatus } from '@constants/Request'
import { IReserve } from '@graph/pools/types'
import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
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
  name: StoreKeys.Tokens,
  reducers: {
    fetchReservesRequest: (state) => {
      state.status = RequestStatus.Pending
    },
    fetchReservesSuccess: (state, action: PayloadAction<IReserve[]>) => {
      state.status = RequestStatus.Resolved
      reservesAdapter.upsertMany(state, action.payload)
      return state
    },
    fetchReservesFailure: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
  },
})

export const reservesActions = ReservesSlice.actions
export const reservesReducer = ReservesSlice.reducer
