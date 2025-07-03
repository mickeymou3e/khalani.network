import { ActionInProgress } from '@constants/Action'
import { RequestStatus } from '@constants/Request'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'

const initProviderState: {
  status: RequestStatus
  errorMessage?: string
  actionInProgress?: ActionInProgress
  latestBlock?: number
} = {
  status: RequestStatus.Idle,
  errorMessage: undefined,
  actionInProgress: undefined,
  latestBlock: undefined,
}

export const providerSlice = createSlice({
  initialState: initProviderState,
  name: StoreKeys.Provider,
  reducers: {
    initializeProviderRequest: (state, _action: PayloadAction) => state,
    initializeProviderSuccess: (state) => {
      state.status = RequestStatus.Resolved
      return state
    },
    initializeProviderFailure: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
    updateLatestBlock: (state, action: PayloadAction<number>) => {
      const latestBlock = action.payload
      return {
        ...state,
        latestBlock,
      }
    },
  },
})

export const providerActions = providerSlice.actions
export const providerReducer = providerSlice.reducer
