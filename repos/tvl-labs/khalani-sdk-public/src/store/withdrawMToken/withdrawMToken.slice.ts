import { RequestStatus } from '@constants/Request'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import {
  IWithdrawMTokenSagaState,
  WithdrawMTokenParams,
} from './withdrawMToken.types'

const initWithdrawMTokenSliceState: IWithdrawMTokenSagaState = {
  status: RequestStatus.Idle,
  params: null,
  signed: false,
  initialized: false,
  loading: false,
  error: null,
}

export const WithdrawMTokenSlice = createSlice({
  initialState: initWithdrawMTokenSliceState,
  name: StoreKeys.WithdrawMToken,
  reducers: {
    withdrawMTokenRequest: (
      state,
      action: PayloadAction<WithdrawMTokenParams>,
    ) => ({
      ...state,
      params: action.payload,
      loading: true,
      initialized: false,
      error: null,
    }),
    withdrawMTokenSuccess: (state) => ({
      ...state,
      loading: false,
      initialized: true,
      status: RequestStatus.Resolved,
      error: null,
    }),
    withdrawMTokenFailure: (state, error: PayloadAction<string>) => ({
      ...state,
      loading: false,
      initialized: false,
      status: RequestStatus.Rejected,
      error: error.payload,
    }),
    signed: (state) => ({
      ...state,
      signed: true,
    }),
    clearState: () => initWithdrawMTokenSliceState,
  },
})

export const withdrawMTokenActions = WithdrawMTokenSlice.actions
export const withdrawMTokenReducer = WithdrawMTokenSlice.reducer
