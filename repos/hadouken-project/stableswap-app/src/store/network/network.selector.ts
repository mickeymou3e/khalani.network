import { Network } from '@constants/Networks'
import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

import { selectReducer } from '../store.utils'

const latestBlock = createSelector(
  selectReducer(StoreKeys.Network),
  (reducerState) => reducerState.latestBlock,
)

const applicationNetworkName = createSelector(
  selectReducer(StoreKeys.Network),
  (reducerState) => reducerState.applicationNetworkName as string,
)

const isExpectedNetwork = createSelector(
  [selectReducer(StoreKeys.Network)],
  (state) => {
    return state.applicationChainId === state.walletChainId
  },
)
const applicationChainId = createSelector(
  selectReducer(StoreKeys.Network),
  (state) => state.applicationChainId as Network,
)

export const networkSelectors = {
  latestBlock,
  applicationNetworkName,
  isExpectedNetwork,
  applicationChainId,
}
