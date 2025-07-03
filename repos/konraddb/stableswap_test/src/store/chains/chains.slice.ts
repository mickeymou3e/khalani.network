import { RequestStatus } from '@constants/Request'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { IChain, IChainsSliceState } from './chains.types'

const initChainSliceState: IChainsSliceState = {
  status: RequestStatus.Idle,
  chains: [],
}

export const chainsSlice = createSlice({
  initialState: initChainSliceState,
  name: StoreKeys.Chains,
  reducers: {
    initializeChainsRequest: (state) => state,
    initializeChainsSuccess: (state) => {
      state.status = RequestStatus.Resolved
      return state
    },
    initializeChainsFailure: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
    updateChains: (state, action: PayloadAction<IChain[]>) => {
      const chains = [...action.payload]
      return { ...state, chains }
    },
  },
})

export const chainsActions = chainsSlice.actions
export const chainsReducer = chainsSlice.reducer
