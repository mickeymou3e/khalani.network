import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '@store/store.keys'
import { FallbackProvider, JsonRpcProvider } from 'ethers-v6'
import { ProviderSliceState } from './provider.types'

const initProviderState: ProviderSliceState = {
  provider: null,
  signer: null,
  signerv5: null,
  network: null,
  userAddress: null,
}

export const providerSlice = createSlice({
  initialState: initProviderState,
  name: StoreKeys.Provider,
  reducers: {
    update: (_state, action: PayloadAction<ProviderSliceState>) =>
      action.payload,
    updateProvider: (
      state,
      action: PayloadAction<JsonRpcProvider | FallbackProvider>,
    ) => ({
      ...state,
      provider: action.payload,
    }),
  },
})

export const providerActions = providerSlice.actions
export const providerReducer = providerSlice.reducer
