import { BigNumber } from 'ethers'

import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'

export interface IPrice {
  id: string
  price: BigNumber
}

export const pricesAdapter = createEntityAdapter<IPrice>()

const initPricesSliceState = pricesAdapter.getInitialState()

export const pricesSlice = createSlice({
  initialState: initPricesSliceState,
  name: StoreKeys.Prices,
  reducers: {
    updatePricesRequest: (state, _action: PayloadAction<IPrice[]>) => state,
    updatePricesSuccess: (state, action: PayloadAction<IPrice[]>) => {
      pricesAdapter.setAll(state, action.payload)
      return state
    },
    updatePricesFailure: (state) => {
      return state
    },
  },
})

export const pricesActions = pricesSlice.actions
export const pricesReducer = pricesSlice.reducer
