import { providers } from 'ethers'

import config from '@config'
import { createSelector } from '@reduxjs/toolkit'
import { getWebsocketProvider } from '@store/provider/provider.initialize.saga'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'
import { walletSelectors } from '@store/wallet/wallet.selector'

const provider = createSelector(
  [selectReducer(StoreKeys.Provider)],
  (providerReducerState) => providerReducerState.provider,
)

const axonProvider = createSelector(
  [selectReducer(StoreKeys.Provider)],
  () => new providers.StaticJsonRpcProvider(config.godwoken.rpcUrl),
)

const wsProvider = createSelector([provider], (provider) => {
  if (provider) {
    return getWebsocketProvider()
  }

  return null
})

const balancerChainProvider = createSelector(
  [provider, axonProvider],
  (connectedWalletProvider, readonlyAxonProvider) => {
    if (
      connectedWalletProvider?.network.chainId ===
      parseInt(config.godwoken.chainId, 16)
    ) {
      return connectedWalletProvider
    }

    return readonlyAxonProvider
  },
)

const balancerChainSigner = createSelector(
  [balancerChainProvider, walletSelectors.userAddress],
  (provider, connectedUserAddress) => {
    return provider.getSigner(connectedUserAddress || undefined)
  },
)

/**
 * AddressTranslator to obtain Godwoken addresses from Ethereum addresses
 */
const addressTranslator = createSelector([provider], (provider) => {
  if (provider) {
    return 'test'
  }
  return null
})

export const providerSelector = {
  provider,
  wsProvider,
  addressTranslator,
  axonProvider,
  balancerChainProvider,
  balancerChainSigner,
}
