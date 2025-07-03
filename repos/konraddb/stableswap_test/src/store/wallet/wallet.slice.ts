import { BigNumber } from 'ethers'

import { RequestStatus } from '@constants/Request'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getNetworkName } from '@utils/network'

import { StoreKeys } from '../store.keys'
import { SelectWalletConnectionStage } from './connection/types'
import { InitializeWalletResponse, WalletState } from './wallet.types'

export const WalletSlice = createSlice({
  initialState: { ...new WalletState() },
  name: StoreKeys.Wallet,
  reducers: {
    initializeWalletRequest: (state) => {
      state.ethAddress = null
      state.godwokenShortAddress = null
      state.ckbAddress = null
      state.chainId = null
      state.networkName = null
      state.errorMessage = null
      state.lastTx = null
      state.status = RequestStatus.Pending
      state.nativeTokenBalance = null

      return state
    },
    initializeWalletSuccess: (
      state,
      action: PayloadAction<Required<InitializeWalletResponse>>,
    ) => {
      const {
        ethAddress,
        godwokenShortAddress,
        ckbAddress,
        chainId,
        nativeTokenBalance,
      } = action.payload
      return {
        ...state,
        godwokenShortAddress,
        ckbAddress,
        ethAddress,
        chainId,
        nativeTokenBalance,
        networkName: getNetworkName(chainId),
        status: RequestStatus.Resolved,
      }
    },
    initializeWalletFailure: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
    onAccountChange: (
      state,
      action: PayloadAction<Required<string | null>>,
    ) => {
      state.ethAddress = action.payload
      return state
    },
    onNetworkChange: (state, action: PayloadAction<Required<string>>) => {
      state.chainId = action.payload
      state.networkName = getNetworkName(action.payload)
      return state
    },
    switchMetamaskNetwork: (state) => {
      return state
    },
    changeConnectionStage: (
      state,
      action: PayloadAction<SelectWalletConnectionStage>,
    ) => {
      const { type, status, payload } = action.payload
      state.connectionStage = {
        type,
        status,
        payload,
      }

      return state
    },
    setLastTx: (state, action: PayloadAction<Required<string>>) => {
      state.lastTx = action.payload
      return state
    },
    setUserNativeTokenBalance: (state, action: PayloadAction<BigNumber>) => {
      return {
        ...state,
        nativeTokenBalance: action.payload,
      }
    },
  },
})

export const walletActions = WalletSlice.actions
export const walletReducer = WalletSlice.reducer
