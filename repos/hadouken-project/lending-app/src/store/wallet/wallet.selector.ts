import { RequestStatus } from '@constants/Request'
import { MetaMaskInpageProvider } from '@metamask/inpage-provider'
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

const windowEthereum = createSelector(
  [],
  () => window.ethereum as MetaMaskInpageProvider,
)

const applicationChainId = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) => reducerState.applicationChainId as string,
)

const ethAddress = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) => reducerState.ethAddress,
)

const applicationNetworkName = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) => reducerState.applicationNetworkName ?? undefined,
)

const walletNetworkName = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) => reducerState.walletNetworkName,
)

const walletChainId = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) => reducerState.walletChainId as string,
)

const walletSagaInitialized = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) =>
    reducerState.status === RequestStatus.Resolved ||
    reducerState.status === RequestStatus.Rejected,
)

const ckbAddress = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) => reducerState.ckbAddress,
)

const isOpenNetworkModal = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) => reducerState.isOpenNetworkModal,
)

const isConnectedToSupportedNetwork = createSelector(
  selectReducer(StoreKeys.Wallet),
  (state) => state.walletChainId === state.applicationChainId,
)

export const walletSelectors = {
  isConnected,
  connectionStateStatus,
  applicationChainId,
  ethAddress,
  applicationNetworkName,
  walletSagaInitialized,
  ckbAddress,
  isOpenNetworkModal,
  walletNetworkName,
  walletChainId,
  windowEthereum,
  isConnectedToSupportedNetwork,
}
