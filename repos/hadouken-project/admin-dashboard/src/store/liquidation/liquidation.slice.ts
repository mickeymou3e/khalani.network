import { RequestStatus } from '@constants/Request'
import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { ILiquidationsSagaState, LiquidationDisplay } from './liquidation.types'

export const liquidationAdapter = createEntityAdapter<LiquidationDisplay>()

const initLiquidationsSliceState = liquidationAdapter.getInitialState<ILiquidationsSagaState>(
  {
    status: RequestStatus.Idle,
  },
)

export const LiquidationsSlice = createSlice({
  initialState: initLiquidationsSliceState,
  name: StoreKeys.Tokens,
  reducers: {
    fetchLiquidationsRequest: (state) => {
      state.status = RequestStatus.Pending
    },
    fetchLiquidationsSuccess: (
      state,
      action: PayloadAction<LiquidationDisplay[]>,
    ) => {
      state.status = RequestStatus.Resolved
      liquidationAdapter.upsertMany(state, action.payload)
      return state
    },
    fetchLiquidationsFailure: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
  },
})

export const liquidationsActions = LiquidationsSlice.actions
export const liquidationsReducer = LiquidationsSlice.reducer
