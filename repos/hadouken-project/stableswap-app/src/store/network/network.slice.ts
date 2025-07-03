import { Network } from '@constants/Networks'
import { RequestStatus } from '@constants/Request'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getNetworkName } from '@utils/network'

import { StoreKeys } from '../store.keys'
import { INetworkSliceState } from './network.types'

const initNetworkSliceState: INetworkSliceState = {
  status: RequestStatus.Idle,
  walletChainId: null,
  walletNetworkName: null,
  latestBlock: null,
  applicationChainId: null,
  applicationNetworkName: null,
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
    updateLatestBlock: (
      state,
      action: PayloadAction<{ latestBlock: number }>,
    ) => {
      return {
        ...state,
        latestBlock: action.payload.latestBlock,
      }
    },
    updateNetwork: (state, action: PayloadAction<Network>) => {
      const network = action.payload
      return {
        ...state,
        walletChainId: network,
        walletNetworkName: getNetworkName(network),
      }
    },
    setApplicationChainId: (state, action: PayloadAction<string>) => {
      state.applicationChainId = action.payload

      return state
    },
    setApplicationNetworkName: (state, action: PayloadAction<string>) => {
      state.applicationNetworkName = getNetworkName(action.payload)

      return state
    },
  },
})

export const networkActions = networkSlice.actions
export const networkReducer = networkSlice.reducer
