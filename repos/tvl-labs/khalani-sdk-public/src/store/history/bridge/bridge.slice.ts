import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { BridgeHistory } from './bridge.types'

export interface BridgeHistoryState {
  loading: boolean
  error: string | null
  bridgeHistory: BridgeHistory[] | null
}

const initialState: BridgeHistoryState = {
  loading: false,
  error: null,
  bridgeHistory: null,
}

const bridgeHistorySlice = createSlice({
  name: StoreKeys.BridgeHistory,
  initialState,
  reducers: {
    request(state) {
      state.loading = true
      state.error = null
    },
    requestSuccess(state, action: PayloadAction<BridgeHistory[]>) {
      state.loading = false
      state.error = null
      state.bridgeHistory = action.payload
    },
    requestError(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
      state.bridgeHistory = null
    },
  },
})

export const bridgeHistoryActions = bridgeHistorySlice.actions
export const bridgeHistoryReducer = bridgeHistorySlice.reducer
