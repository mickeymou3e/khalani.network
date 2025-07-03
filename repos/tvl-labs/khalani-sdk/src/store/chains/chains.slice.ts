import config from '@config'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { IChain, IChainsSliceState } from './chains.types'

const initChainSliceState: IChainsSliceState = {
  chains: config.supportedChains as IChain[],
}

export const chainsSlice = createSlice({
  initialState: initChainSliceState,
  name: StoreKeys.Chains,
  reducers: {
    updateChains: (state, action: PayloadAction<IChain[]>) => {
      const chains = [...action.payload]
      return { ...state, chains }
    },
  },
})

export const chainsActions = chainsSlice.actions
export const chainsReducer = chainsSlice.reducer
