import { providers } from 'ethers'

import { RequestStatus } from '@constants/Request'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { ProviderSliceState } from './provider.types'

const initProviderState: ProviderSliceState = {
  status: RequestStatus.Idle,
  provider: null,
}

export const providerSlice = createSlice({
  initialState: initProviderState,
  name: StoreKeys.Provider,
  reducers: {
    initializeProviderRequest: (state, _action: PayloadAction) => state,
    initializeProviderSuccess: (
      state,
      action: PayloadAction<providers.Web3Provider>,
    ) => {
      state.provider = action.payload
      state.status = RequestStatus.Resolved
      return state
    },
    initializeProviderFailure: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
  },
})

export const providerActions = providerSlice.actions
export const providerReducer = providerSlice.reducer
