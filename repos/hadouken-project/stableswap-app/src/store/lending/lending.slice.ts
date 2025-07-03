import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { BigDecimal } from '@utils/math'

import { StoreKeys } from '../store.keys'
import { ILendingReserve } from './lending.types'

export const lendingReservesAdapter = createEntityAdapter<ILendingReserve>()

export const lendingSlice = createSlice({
  initialState: {
    reserves: lendingReservesAdapter.getInitialState(),
    yieldFee: BigDecimal.from(0, 25),
  },
  name: StoreKeys.Lending,
  reducers: {
    fetchLendingTokensRequest: (state) => state,
    fetchLendingTokensSuccess: (
      state,
      action: PayloadAction<{
        reserves: ILendingReserve[]
        yieldFee: BigDecimal
      }>,
    ) => {
      lendingReservesAdapter.setAll(state.reserves, action.payload.reserves)
      state.yieldFee = action.payload.yieldFee
      return state
    },
    fetchLendingTokensFailure: (state) => state,
  },
})

export const lendingActions = lendingSlice.actions
export const lendingReducer = lendingSlice.reducer
