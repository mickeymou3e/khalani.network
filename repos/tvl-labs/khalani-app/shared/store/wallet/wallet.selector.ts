import { createSelector } from '@reduxjs/toolkit'
import { providerSelector } from '@tvl-labs/sdk'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

const userAddress = createSelector(
  [providerSelector.userAddress],
  (userAddress) => userAddress,
)

const latestBlock = createSelector(
  [selectReducer(StoreKeys.Wallet)],
  (reducerState) => reducerState.latestBlock,
)

const network = createSelector([providerSelector.network], (network) => network)

export const walletSelectors = {
  userAddress,
  latestBlock,
  network,
}
