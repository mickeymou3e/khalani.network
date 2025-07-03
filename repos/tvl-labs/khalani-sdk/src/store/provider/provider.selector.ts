import { getBalancerChain } from '@utils/chains'
import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { JsonRpcProvider, Wallet } from 'ethers-v6'
import { providers as providersv5 } from 'ethers'
import { KHALANI_PRIVATE_KEY_HEX } from '../../e2e/config'
import { selectReducer } from '@store/store.utils'
import { CustomJsonRpcProvider } from '@classes/CustomJsonRpcProvider'

const provider = createSelector(
  [selectReducer(StoreKeys.Provider)],
  (providerReducerState) => providerReducerState.provider,
)

const signer = createSelector(
  [selectReducer(StoreKeys.Provider)],
  (providerReducerState) => providerReducerState.signer,
)

const signerv5 = createSelector(
  [selectReducer(StoreKeys.Provider)],
  (providerReducerState) => providerReducerState.signerv5,
)

const userAddress = createSelector(
  [selectReducer(StoreKeys.Provider)],
  (providerReducerState) => providerReducerState.userAddress,
)

const network = createSelector(
  [selectReducer(StoreKeys.Provider)],
  (providerReducerState) => providerReducerState.network,
)

const balancerChainProvider = createSelector(
  [selectReducer(StoreKeys.Provider)],
  (provider) => provider && new JsonRpcProvider(getBalancerChain().rpcUrls[0]),
)

const customArcadiaChainProvider = createSelector(
  [selectReducer(StoreKeys.Provider)],
  (provider) =>
    provider && new CustomJsonRpcProvider(getBalancerChain().rpcUrls[0]),
)

const balancerChainProviderv5 = createSelector(
  [selectReducer(StoreKeys.Provider)],
  (provider) =>
    provider && new providersv5.JsonRpcProvider(getBalancerChain().rpcUrls[0]),
)

const khalaniSigner = createSelector(
  [balancerChainProvider],
  (provider) => provider && new Wallet(KHALANI_PRIVATE_KEY_HEX, provider),
)

export const providerSelector = {
  provider,
  signer,
  signerv5,
  balancerChainProvider,
  network,
  userAddress,
  balancerChainProviderv5,
  khalaniSigner,
  customArcadiaChainProvider,
}
