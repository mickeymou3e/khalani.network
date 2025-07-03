import { RequestStatus } from '@constants/Request'
import { getNetworkName } from '@hadouken-project/lending-contracts'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import {
  ConnectionState,
  ConnectionStatus,
  InitializeWalletResponse,
  WalletReduxState,
} from './wallet.types'

export const WalletSlice = createSlice({
  initialState: { ...new WalletReduxState() },
  name: StoreKeys.Wallet,
  reducers: {
    initializeWalletRequest: (state) => {
      state.ethAddress = undefined
      state.ckbAddress = undefined
      state.applicationNetworkName = undefined
      state.errorMessage = undefined
      state.status = RequestStatus.Pending
      state.isOpenNetworkModal = false
      return state
    },
    initializeWalletSuccess: (
      state,
      action: PayloadAction<Required<InitializeWalletResponse>>,
    ) => {
      const { ethAddress, ckbAddress } = action.payload

      return {
        ...state,
        ckbAddress,
        ethAddress,
        status: RequestStatus.Resolved,
      }
    },
    initializeWalletFailure: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
    onAccountChange: (
      state,
      action: PayloadAction<Required<string | undefined>>,
    ) => {
      state.ethAddress = action.payload
      return state
    },
    onNetworkChange: (state, action: PayloadAction<Required<string>>) => {
      state.walletChainId = action.payload
      state.walletNetworkName = getNetworkName(action.payload)
      return state
    },
    changeConnectionStateStatus: (
      state,
      action: PayloadAction<
        Required<{ connectionState: ConnectionState; status: ConnectionStatus }>
      >,
    ) => {
      state.connectionState = action.payload.connectionState
      state.connectionStateStatus = action.payload.status
      return state
    },
    switchNetworkToSupported: (state, _action: PayloadAction<string>) => {
      return state
    },
    openNetworkModal: (state) => {
      state.isOpenNetworkModal = true

      return state
    },
    closeNetworkModal: (state) => {
      state.isOpenNetworkModal = false

      return state
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

export const walletActions = WalletSlice.actions
export const walletReducer = WalletSlice.reducer
