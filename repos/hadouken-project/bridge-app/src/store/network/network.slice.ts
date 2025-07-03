import Config from '@config'
import { RequestStatus } from '@constants/Request'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { INetworkSliceState } from './network.types'

const initNetworkSliceState: INetworkSliceState = {
  status: RequestStatus.Idle,
  network: null,
  expectedNetwork: Config.godwoken.chainId,
  latestBlock: null,
}

export const networkSlice = createSlice({
  initialState: initNetworkSliceState,
  name: StoreKeys.Network,
  reducers: {
    initializeNetworkRequest: (state, _action: PayloadAction) => state,
    initializeNetworkSuccess: (state) => {
      state.status = RequestStatus.Resolved
      return state
    },
    initializeNetworkFailure: (state) => {
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
    updateNetwork: (state, action: PayloadAction<string>) => {
      const network = action.payload
      return {
        ...state,
        network,
      }
    },
    updateExpectedNetwork: (state, action: PayloadAction<string>) => {
      const expectedNetwork = action.payload
      return {
        ...state,
        expectedNetwork,
      }
    },
  },
})

export const networkActions = networkSlice.actions
export const networkReducer = networkSlice.reducer
