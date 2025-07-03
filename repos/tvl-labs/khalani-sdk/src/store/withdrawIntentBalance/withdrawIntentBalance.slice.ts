import { RequestStatus } from '@constants/Request'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import {
  IWithdrawIntentBalanceSagaState,
  WithdrawIntentBalanceParams,
} from './withdrawIntentBalance.types'

const initWithdrawIntentBalanceSliceState: IWithdrawIntentBalanceSagaState = {
  status: RequestStatus.Idle,
  params: null,
  loading: false,
  signed: false,
  initialized: false,
  error: null,
}

export const WithdrawIntentBalanceSlice = createSlice({
  initialState: initWithdrawIntentBalanceSliceState,
  name: StoreKeys.WithdrawIntentBalance,
  reducers: {
    withdrawIntentBalanceRequest: (
      state,
      action: PayloadAction<WithdrawIntentBalanceParams>,
    ) => ({
      ...state,
      params: action.payload,
      loading: true,
      initialized: false,
      error: null,
    }),
    withdrawIntentBalanceSuccess: (state) => ({
      ...state,
      loading: false,
      initialized: true,
      status: RequestStatus.Resolved,
      error: null,
    }),
    withdrawIntentBalanceFailure: (state, error: PayloadAction<string>) => ({
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
    clearState: () => initWithdrawIntentBalanceSliceState,
  },
})

export const withdrawIntentBalanceActions = WithdrawIntentBalanceSlice.actions
export const withdrawIntentBalanceReducer = WithdrawIntentBalanceSlice.reducer
