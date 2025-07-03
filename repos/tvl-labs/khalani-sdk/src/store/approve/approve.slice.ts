import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { IApprovalToken, IApproveSliceState } from './approve.types'

const initApproveSliceState: IApproveSliceState = {
  loading: false,
  approvalTokens: [],
}

export const approveSlice = createSlice({
  initialState: initApproveSliceState,
  name: StoreKeys.Approve,
  reducers: {
    approveRequest: (state, action: PayloadAction<IApprovalToken[]>) => ({
      approvalTokens: action.payload,
      loading: true,
    }),
    approveRequestSuccess: (state) => ({
      ...state,
      loading: false,
    }),
    approveRequestError: (state, error: PayloadAction<string>) => ({
      ...state,
      error: error.payload,
    }),
  },
})

export const approveActions = approveSlice.actions
export const approveReducer = approveSlice.reducer
