import { RequestStatus } from '@constants/Request'
import { createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '@store/store.keys'
import { SDKSliceState } from './sdk.types'

const initSDKState: SDKSliceState = {
  status: RequestStatus.Idle,
  isInitialized: false,
}

export const sdkSlice = createSlice({
  initialState: initSDKState,
  name: StoreKeys.SDK,
  reducers: {
    initializeSDKRequest: (state) => {
      state.status = RequestStatus.Pending
      return state
    },
    initializeSDKSuccess: (state) => {
      state.status = RequestStatus.Resolved
      state.isInitialized = true
      return state
    },
    initializeSDKFailure: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
  },
})

export const sdkActions = sdkSlice.actions
export const sdkReducer = sdkSlice.reducer
