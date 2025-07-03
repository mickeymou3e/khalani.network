import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { LiquidityHistory } from './liquidity.types'

export interface LiquidityHistoryState {
  loading: boolean
  error: string | null
  liquidityHistory: LiquidityHistory[] | null
}

const initialState: LiquidityHistoryState = {
  loading: false,
  error: null,
  liquidityHistory: null,
}

const liquidityHistorySlice = createSlice({
  name: StoreKeys.LiquidityHistory,
  initialState,
  reducers: {
    request(state) {
      state.loading = true
      state.error = null
    },
    requestSuccess(state, action: PayloadAction<LiquidityHistory[]>) {
      state.loading = false
      state.error = null
      state.liquidityHistory = action.payload
    },
    requestError(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
      state.liquidityHistory = null
    },
  },
})

export const liquidityHistoryActions = liquidityHistorySlice.actions
export const liquidityHistoryReducer = liquidityHistorySlice.reducer
