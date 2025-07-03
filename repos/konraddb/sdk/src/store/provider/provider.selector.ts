import { getBalancerChain } from '../../config'
import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '../../store/store.keys'
import { selectReducer } from '../../store/store.utils'
import { providers } from 'ethers'

const provider = createSelector(
  [selectReducer(StoreKeys.Provider)],
  (providerReducerState) => providerReducerState.provider,
)

const signer = createSelector([provider], (provider) => provider?.getSigner())

const userAddress = createSelector(
  [selectReducer(StoreKeys.Provider)],
  (providerReducerState) => providerReducerState.userAddress,
)

const network = createSelector(
  [selectReducer(StoreKeys.Provider)],
  (providerReducerState) => providerReducerState.network,
)

const axonProvider = createSelector(
  selectReducer(StoreKeys.Provider),
  () => new providers.StaticJsonRpcProvider(getBalancerChain().rpcUrls[0]),
)

const balancerChainProvider = createSelector(
  [provider, axonProvider, network],
  (connectedWalletProvider, readonlyAxonProvider, network) => {
    if (network && parseInt(network, 16) === getBalancerChain().id) {
      return connectedWalletProvider
    }
    return readonlyAxonProvider
  },
)

const balancerChainSigner = createSelector(
  [balancerChainProvider, signer],
  (provider, signer) => {
    if (provider) {
      const address = signer?._address
      return provider.getSigner(address || undefined)
    }
    return
  },
)

export const providerSelector = {
  provider,
  signer,
  axonProvider,
  balancerChainProvider,
  balancerChainSigner,
  network,
  userAddress,
}
