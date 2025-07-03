import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { IDeposit, IDepositRequest, IDepositSliceState } from './deposit.types'

const initDepositSliceState: IDepositSliceState = {
  inTokens: [],
  inTokensAmounts: [],
  loading: false,
  outToken: undefined,
  outTokenAmounts: undefined,
}

export const depositSlice = createSlice({
  initialState: initDepositSliceState,
  name: StoreKeys.Deposit,
  reducers: {
    depositPreviewRequest: (state, _action: PayloadAction<IDepositRequest>) => {
      if (state) {
        return {
          ...state,
          loading: true,
        }
      } else {
        return {
          loading: true,
        }
      }
    },
    depositPreviewRequestSuccess: (state, action: PayloadAction<IDeposit>) => {
      const swap = action.payload

      return {
        ...swap,
        loading: false,
      }
    },
    depositPreviewRequestError: (state, error: PayloadAction<string>) => ({
      ...state,
      error: error.payload,
    }),
    depositPreviewReset: (state) => state,
    depositRequest: (state) => state,
  },
})

export const depositActions = depositSlice.actions
export const depositReducer = depositSlice.reducer
