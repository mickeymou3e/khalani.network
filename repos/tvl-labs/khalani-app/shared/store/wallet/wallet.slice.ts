import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProviderSliceState } from '@tvl-labs/sdk/dist/app/src/store/provider/provider.types'

import { StoreKeys } from '../store.keys'
import { WalletState } from './wallet.types'

export const WalletSlice = createSlice({
  initialState: { ...new WalletState() },
  name: StoreKeys.Wallet,
  reducers: {
    update: (state, _action: PayloadAction<ProviderSliceState>) => state,
    createSafe: (state) => state,
    updateLatestBlock: (state, action: PayloadAction<number>) => {
      state.latestBlock = action.payload
      return state
    },
    updateNativeTokenBalance: (state, action: PayloadAction<bigint>) => {
      state.nativeTokenBalance = action.payload
      return state
    },
  },
})

export const walletActions = WalletSlice.actions
export const walletReducer = WalletSlice.reducer
