import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import {
  ICrossChainDepositSliceState,
  ICrossChainDeposit,
  ICrossChainDepositRequest,
} from './crossChainDeposit.types'

const initDepositSliceState: ICrossChainDepositSliceState = {
  inTokens: [],
  inTokensAmounts: [],
  loading: false,
  outToken: undefined,
  outTokenAmounts: undefined,
}

export const crossChainDepositSlice = createSlice({
  initialState: initDepositSliceState,
  name: StoreKeys.CrossChainDeposit,
  reducers: {
    depositPreviewRequest: (
      state,
      _action: PayloadAction<ICrossChainDepositRequest>,
    ) => ({
      ...state,
      loading: true,
    }),
    depositPreviewRequestSuccess: (
      state,
      action: PayloadAction<ICrossChainDeposit>,
    ) => {
      const swap = action.payload

      return {
        ...swap,
        loading: false,
      }
    },
    depositRequest: (state) => state,
  },
})

export const crossChainDepositActions = crossChainDepositSlice.actions
export const crossChainDepositReducer = crossChainDepositSlice.reducer
