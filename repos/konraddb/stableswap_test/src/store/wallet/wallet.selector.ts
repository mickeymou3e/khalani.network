import { RequestStatus } from '@constants/Request'
import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { ConnectionStageStatus, ConnectionStageType } from './connection/types'

const connectionStageType = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) =>
    reducerState.status === RequestStatus.Pending
      ? ConnectionStageType.Idle
      : reducerState.connectionStage.type,
)

const connectionStage = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) => reducerState.connectionStage,
)

const isConnected = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) =>
    reducerState.ethAddress !== null &&
    reducerState.connectionStage.type === ConnectionStageType.Connected &&
    reducerState.connectionStage.status === ConnectionStageStatus.Success,
)

const chainId = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) => reducerState.chainId,
)

const userAddress = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) => reducerState.ethAddress,
)

const godwokenShortAddress = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) => reducerState.godwokenShortAddress,
)

const networkName = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) => reducerState.networkName,
)

const ckbAddress = createSelector(
  selectReducer(StoreKeys.Wallet),
  (reducerState) => reducerState.ckbAddress,
)

const lastTx = createSelector(
  selectReducer(StoreKeys.Wallet),
  (state) => state.lastTx,
)

const userNativeTokenBalance = createSelector(
  selectReducer(StoreKeys.Wallet),
  (state) => state.nativeTokenBalance,
)

export const walletSelectors = {
  isConnected,
  connectionStageType,
  connectionStage,
  chainId,
  userAddress,
  godwokenShortAddress,
  networkName,
  ckbAddress,
  lastTx,
  userNativeTokenBalance,
}
