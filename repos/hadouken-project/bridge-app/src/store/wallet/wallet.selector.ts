import { RequestStatus } from '@constants/Request'
import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { ConnectionState } from './wallet.types'

const connectionStateStatus = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) => ({
    connectionState: reducerState.connectionState,
    status: reducerState.connectionStateStatus,
  }),
)
const isConnected = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) =>
    reducerState.ethAddress !== null &&
    reducerState.connectionState === ConnectionState.Connected,
)

const chainId = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) => reducerState.chainId,
)

const ethAddress = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) => reducerState.ethAddress,
)

const userNativeTokenBalance = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) => reducerState.nativeTokenBalance,
)

const networkName = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) => reducerState.networkName,
)

const walletSagaInitialized = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) =>
    reducerState.status === RequestStatus.Resolved ||
    reducerState.status === RequestStatus.Rejected,
)

const connectToMetaMaskStatus = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) => reducerState.connectToMetaMaskStatus,
)

const ckbAddress = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) => reducerState.ckbAddress,
)

export const walletSelectors = {
  isConnected,
  connectionStateStatus,
  chainId,
  ethAddress,
  userNativeTokenBalance,
  networkName,
  connectToMetaMaskStatus,
  walletSagaInitialized,
  ckbAddress,
}
