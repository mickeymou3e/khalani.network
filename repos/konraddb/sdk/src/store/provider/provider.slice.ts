import { providers } from 'ethers'

import { RequestStatus } from '../../constants/Request'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { ProviderSliceState } from './provider.types'
import { Network } from '../../constants/Networks'
import { Address } from '../../store/tokens/tokens.types'

const initProviderState: ProviderSliceState = {
  status: RequestStatus.Idle,
  provider: null,
  signer: null,
  network: null,
  userAddress: null,
}

export const providerSlice = createSlice({
  initialState: initProviderState,
  name: StoreKeys.Provider,
  reducers: {
    initializeProviderRequest: (state) => {
      state.status = RequestStatus.Pending
      return state
    },
    initializeProviderSuccess: (state) => {
      state.status = RequestStatus.Resolved
      return state
    },
    initializeProviderFailure: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
    updateProvider: (state, action: PayloadAction<providers.Web3Provider>) => {
      state.provider = action.payload
      return state
    },
    updateNetwork: (state, action: PayloadAction<Network>) => {
      state.network = action.payload
      return state
    },
    updateAddress: (state, action: PayloadAction<Address>) => {
      state.userAddress = action.payload
      return state
    },
  },
})

export const providerActions = providerSlice.actions
export const providerReducer = providerSlice.reducer
