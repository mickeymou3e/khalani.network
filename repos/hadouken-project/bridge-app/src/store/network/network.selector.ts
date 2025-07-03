import config from '@config'
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

const isCorrectNetwork = createSelector(
  [network, expectedNetwork],
  (network, expectedNetwork) => network === expectedNetwork,
)

const isGodwokenNetwork = createSelector(
  [network, expectedNetwork],
  (network) => network === config.godwoken.chainId,
)

export const networkSelectors = {
  latestBlock,
  network,
  expectedNetwork,
  isCorrectNetwork,
  isGodwokenNetwork,
}
