import Config from '@config'
import { Network } from '@constants/Networks'
import { RequestStatus } from '@constants/Request'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { INetworkSliceState } from './network.types'

const initNetworkSliceState: INetworkSliceState = {
  status: RequestStatus.Idle,
  network: null,
  expectedNetwork: Config.godwoken.chainId as Network,
  latestBlock: null,
  reloaded: false,
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
    updateNetwork: (state, action: PayloadAction<Network | null>) => {
      const network = action.payload
      return {
        ...state,
        network,
      }
    },
    updateExpectedNetwork: (state, action: PayloadAction<Network>) => {
      const expectedNetwork = action.payload
      return {
        ...state,
        expectedNetwork,
      }
    },
    updateReloaded: (state, action: PayloadAction<boolean>) => {
      const reloaded = action.payload
      return {
        ...state,
        reloaded,
      }
    },
  },
})

export const networkActions = networkSlice.actions
export const networkReducer = networkSlice.reducer
