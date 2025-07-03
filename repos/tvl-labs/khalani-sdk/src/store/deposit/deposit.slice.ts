import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '@store/store.keys'
import { IDepositSliceState, DepositParams } from './deposit.types'

const initDepositSliceState: IDepositSliceState = {
  loading: false,
  initialized: false,
  params: null,
  error: null,
}

export const depositSlice = createSlice({
  initialState: initDepositSliceState,
  name: StoreKeys.Deposit,
  reducers: {
    request: (state, action: PayloadAction<DepositParams>) => ({
      ...state,
      params: action.payload,
      loading: true,
      isInitialized: false,
      error: null,
    }),
    requestSuccess: (state) => ({
      ...state,
      loading: false,
      initialized: true,
      error: null,
    }),
    requestError: (state, error: PayloadAction<string>) => ({
      ...state,
      error: error.payload,
      initialized: false,
      loading: false,
    }),
    clearState: () => initDepositSliceState,
  },
})

export const depositActions = depositSlice.actions
export const depositReducer = depositSlice.reducer
