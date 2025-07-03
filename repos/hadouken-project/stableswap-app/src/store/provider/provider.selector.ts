import { providers } from 'ethers'

import { getChainConfig } from '@config'
import { createSelector } from '@reduxjs/toolkit'
import { networkSelectors } from '@store/network/network.selector'
import {
  getAddressTranslator,
  getWebsocketProvider,
} from '@store/provider/provider.initialize.saga'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

const provider = createSelector(
  [selectReducer(StoreKeys.Provider)],
  (providerReducerState) => providerReducerState.provider,
)

const fallbackProvider = createSelector(
  [networkSelectors.applicationChainId],
  (chainId) =>
    new providers.JsonRpcProvider(
      getChainConfig(chainId).readOnlyRpcUrl,
      Number(chainId),
    ),
)

const wsProvider = createSelector(
  [provider, fallbackProvider, networkSelectors.applicationChainId],
  (provider, fallbackProvider, chainId) => {
    if (provider || fallbackProvider) {
      return getWebsocketProvider(chainId)
    }

    return null
  },
)

/**
 * AddressTranslator to obtain Godwoken addresses from Ethereum addresses
 */
const addressTranslator = createSelector(
  [provider, networkSelectors.applicationChainId],
  (provider, chainId) => {
    if (provider) {
      return getAddressTranslator(chainId)
    }
    return null
  },
)

export const providerSelector = {
  provider,
  fallbackProvider,
  wsProvider,
  addressTranslator,
}
