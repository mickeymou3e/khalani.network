import { RequestStatus } from '@constants/Request'
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { IPrice, IPriceSliceState } from '@store/prices/prices.types'

import { StoreKeys } from '../store.keys'

export const pricesAdapter = createEntityAdapter<IPrice>()

const initPricesSliceState = pricesAdapter.getInitialState<IPriceSliceState>({
  status: RequestStatus.Idle,
})

export const pricesSlice = createSlice({
  initialState: initPricesSliceState,
  name: StoreKeys.Prices,
  reducers: {
    updatePricesSuccess: (state, action: PayloadAction<IPrice[]>) => {
      state.status = RequestStatus.Resolved

      pricesAdapter.upsertMany(state, action.payload)
      return state
    },
    updatePricesFailure: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
    updatePricesRequest: (state) => {
      state.status = RequestStatus.Pending
      return state
    },
  },
})

export const pricesActions = pricesSlice.actions
export const pricesReducer = pricesSlice.reducer
