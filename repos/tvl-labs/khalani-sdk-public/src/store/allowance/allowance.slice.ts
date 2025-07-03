import { RequestStatus } from '@constants/Request'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '@store/store.keys'
import { IAllowance, IAllowanceSliceState } from './allowance.types'

const initChainSliceState: IAllowanceSliceState = {
  status: RequestStatus.Idle,
  allowances: [],
}

export const allowanceSlice = createSlice({
  initialState: initChainSliceState,
  name: StoreKeys.Allowance,
  reducers: {
    initializeAllowanceRequest: (state) => state,
    initializeAllowanceSuccess: (state) => {
      state.status = RequestStatus.Resolved
      return state
    },
    initializeAllowanceFailure: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
    updateAllowance: (state, action: PayloadAction<IAllowance[]>) => ({
      ...state,
      allowances: [...action.payload],
    }),
  },
})

export const allowanceActions = allowanceSlice.actions
export const allowanceReducer = allowanceSlice.reducer
