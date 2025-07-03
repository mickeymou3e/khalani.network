import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import {
  IWithdraw,
  IWithdrawRequest,
  IWithdrawSliceState,
} from './withdraw.types'

const initWithdrawSliceState: IWithdrawSliceState = {
  inToken: undefined,
  inTokenAmount: undefined,
  loading: false,
  outTokens: [],
  outTokensAmounts: [],
}

export const withdrawSlice = createSlice({
  initialState: initWithdrawSliceState,
  name: StoreKeys.Withdraw,
  reducers: {
    withdrawPreviewRequest: (
      state,
      _action: PayloadAction<IWithdrawRequest>,
    ) => ({
      ...state,
      loading: true,
    }),
    withdrawPreviewRequestSuccess: (
      state,
      action: PayloadAction<IWithdraw>,
    ) => {
      const swap = action.payload

      return {
        ...swap,
        loading: false,
      }
    },
    withdrawPreviewRequestError: (state, error: PayloadAction<string>) => ({
      ...state,
      error: error.payload,
    }),
    withdrawPreviewReset: (state) => {
      return state
    },
    withdrawRequest: (state) => state,
  },
})

export const withdrawActions = withdrawSlice.actions
export const withdrawReducer = withdrawSlice.reducer
