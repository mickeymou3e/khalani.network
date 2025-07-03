import { Network } from '@constants/Networks'
import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

import { selectReducer } from '../store.utils'

const latestBlock = createSelector(
  selectReducer(StoreKeys.Network),
  (reducerState) => reducerState.latestBlock,
)

const network = createSelector(
  selectReducer(StoreKeys.Network),
  (reducerState) => reducerState.network,
)

const expectedNetwork = createSelector(
  selectReducer(StoreKeys.Network),
  (reducerState) => reducerState.expectedNetwork,
)

const isReloaded = createSelector(
  selectReducer(StoreKeys.Network),
  (reducerState) => reducerState.reloaded,
)

const isExpectedNetwork = createSelector(
  [network, expectedNetwork],
  (network, expectedNetwork) => network === expectedNetwork,
)

const isAxonChain = createSelector(
  [network],
  (network) => network === Network.Axon,
)

export const networkSelectors = {
  latestBlock,
  network,
  expectedNetwork,
  isExpectedNetwork,
  isAxonChain,
  isReloaded,
}
