import { RequestStatus } from '@constants/Request'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'

const initProviderState = {
  status: RequestStatus.Idle,
  metamaskProvider: {
    status: RequestStatus.Idle,
  },
  polyjuiceProvider: {
    status: RequestStatus.Idle,
  },
}

export const providerSlice = createSlice({
  initialState: initProviderState,
  name: StoreKeys.Provider,
  reducers: {
    initializeMetamaskProviderRequest: (state, _action: PayloadAction) => state,
    initializeMetamaskProviderSuccess: (state) => {
      state.metamaskProvider.status = RequestStatus.Resolved
      return state
    },
    initializeMetamaskProviderFailure: (state) => {
      state.metamaskProvider.status = RequestStatus.Rejected
      return state
    },
    initializeProviderRequest: (state, _action: PayloadAction) => state,
    initializeProviderSuccess: (state) => {
      state.polyjuiceProvider.status = RequestStatus.Resolved
      return state
    },

    initializeProviderFailure: (state) => {
      state.polyjuiceProvider.status = RequestStatus.Rejected
      return state
    },
  },
})

export const providerActions = providerSlice.actions
export const providerReducer = providerSlice.reducer
