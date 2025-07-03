import { BigNumber } from 'ethers'

import { RequestStatus } from '@constants/Request'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { SelectWalletConnectionStage } from './connection/types'
import { InitializeWalletResponse, WalletState } from './wallet.types'

const initState = { ...new WalletState() }

export const WalletSlice = createSlice({
  initialState: initState,
  name: StoreKeys.Wallet,
  reducers: {
    initializeWalletRequest: (state) => {
      state.ethAddress = null
      state.godwokenShortAddress = null
      state.ckbAddress = null
      state.errorMessage = null
      state.lastTx = null
      state.status = RequestStatus.Pending
      state.nativeTokenBalance = null
      state.isOpenNetworkModal = false

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
        nativeTokenBalance,
      } = action.payload
      return {
        ...state,
        godwokenShortAddress,
        ckbAddress,
        ethAddress,
        nativeTokenBalance,
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
    onNetworkChange: (state) => {
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
    openNetworkModal: (state) => {
      state.isOpenNetworkModal = true

      return state
    },
    closeNetworkModal: (state) => {
      state.isOpenNetworkModal = false

      return state
    },
  },
})

export const walletActions = WalletSlice.actions
export const walletReducer = WalletSlice.reducer
export const walletInitState = initState
