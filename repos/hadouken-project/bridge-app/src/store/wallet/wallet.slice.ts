import { BigNumber } from 'ethers'

import { RequestStatus } from '@constants/Request'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getNetworkName } from '@utils/network'

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
      state.ethAddress = null
      state.ckbAddress = null
      state.chainId = null
      state.networkName = null
      state.nativeTokenBalance = null
      state.errorMessage = null
      state.status = RequestStatus.Pending
      return state
    },
    initializeWalletSuccess: (
      state,
      action: PayloadAction<Required<InitializeWalletResponse>>,
    ) => {
      const {
        ethAddress,
        ckbAddress,
        chainId,
        nativeTokenBalance,
      } = action.payload

      return {
        ...state,
        ckbAddress,
        ethAddress,
        chainId,
        nativeTokenBalance,
        networkName: chainId ? getNetworkName(chainId) : 'unknown',
        status: RequestStatus.Resolved,
      }
    },
    initializeWalletFailure: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
    onAccountChange: (state, action: PayloadAction<Required<string>>) => {
      state.ethAddress = action.payload
      return state
    },
    onNetworkChange: (state, action: PayloadAction<Required<string>>) => {
      const newNetwork = action.payload
      state.chainId = newNetwork
      state.networkName = getNetworkName(newNetwork)
      return state
    },
    setUserNativeTokenBalance: (state, action: PayloadAction<BigNumber>) => {
      return {
        ...state,
        nativeTokenBalance: action.payload,
      }
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
    switchNetworkToSupported: (state) => {
      return state
    },
  },
})

export const walletActions = WalletSlice.actions
export const walletReducer = WalletSlice.reducer
