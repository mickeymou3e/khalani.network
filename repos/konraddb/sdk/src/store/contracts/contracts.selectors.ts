import { Contract } from 'ethers'

import config from '../../config'
import { providerSelector } from '../provider/provider.selector'
import { createSelector } from '@reduxjs/toolkit'
import { AXON_CROSS_CHAIN_ROUTER_ABI } from '../../artifacts/AxonCrossChainRouterArtifact'
import { CROSS_CHAIN_ROUTER_ABI } from '../../artifacts/CrossChainRouterArtifact'
import { PSM_ABI } from '../../artifacts/PSMArtifact'
import { VORTEX_ABI } from '../../artifacts/VortexArtifact'
import { StoreKeys } from '../../store/store.keys'
import { selectReducer } from '../../store/store.utils'
import {
  Vault__factory,
  DIAOracleV2__factory,
  AddressBalances__factory,
  ERC20__factory,
  BalancerHelpers__factory,
} from '@tvl-labs/typechain'

const vault = createSelector([providerSelector.balancerChainSigner], (signer) =>
  signer ? Vault__factory.connect(config.contracts.Vault, signer) : null,
)

const oracle = createSelector(
  [providerSelector.balancerChainSigner],
  (signer) =>
    signer
      ? DIAOracleV2__factory.connect(config.contracts.Oracle, signer)
      : null,
)

const addressBatchBalances = createSelector(
  [providerSelector.axonProvider],
  (provider) =>
    provider
      ? AddressBalances__factory.connect(
          config.contracts.AddressBalances,
          provider,
        )
      : null,
)

const tokenConnector = createSelector(
  [providerSelector.balancerChainSigner],
  (signer) => (tokenAddress: string) =>
    signer ? ERC20__factory.connect(tokenAddress, signer) : null,
)

const errorMessage = createSelector(
  [selectReducer(StoreKeys.Contracts)],
  (contractsState) => contractsState.errorMessage,
)

const axonCrossChainRouterAddress = createSelector(
  [selectReducer(StoreKeys.Contracts)],
  (contractsState) => contractsState.axonCrossChainRouterAddress,
)

const crossChainTokenConnector = createSelector(
  [providerSelector.provider, providerSelector.signer],
  (provider, signer) => (tokenAddress: string) =>
    provider && signer ? ERC20__factory.connect(tokenAddress, signer) : null,
)

const poolHelpers = createSelector(
  [providerSelector.balancerChainSigner],
  (signer) =>
    signer
      ? BalancerHelpers__factory.connect(config.contracts.PoolsHelpers, signer)
      : null,
)

const crossChainRouterAddress = createSelector(
  [providerSelector.network],
  (network) =>
    network
      ? (
          config.contracts.CrossChainRouter as {
            [key: string]: string | undefined
          }
        )[network]
      : null,
)

const crossChainRouter = createSelector(
  [providerSelector.provider, crossChainRouterAddress, providerSelector.signer],
  (provider, crossChainRouterAddress, signer) =>
    provider && crossChainRouterAddress && signer
      ? new Contract(crossChainRouterAddress, CROSS_CHAIN_ROUTER_ABI).connect(
          signer,
        )
      : null,
)

const axonCrossChainRouter = createSelector(
  [providerSelector.balancerChainSigner],
  (signer) =>
    signer
      ? new Contract(
          config.contracts.NexusDiamond,
          AXON_CROSS_CHAIN_ROUTER_ABI,
        ).connect(signer)
      : null,
)

const currentNetworkRouterAddress = createSelector(
  [axonCrossChainRouterAddress, crossChainRouterAddress],
  (_khalaAddress, _crossChainAddress) => _crossChainAddress || _khalaAddress,
)

const vortex = createSelector(
  [providerSelector.balancerChainSigner],
  (signer) =>
    signer
      ? new Contract(config.contracts.Vortex, VORTEX_ABI).connect(signer)
      : null,
)

const psm = createSelector(
  [
    providerSelector.provider,
    providerSelector.network,
    providerSelector.signer,
  ],
  (provider, network, signer) => {
    if (!provider || !network || !signer) {
      return
    }
    const contractAddress = (
      config.contracts.PSM as {
        [key: string]: string | undefined
      }
    )[network]

    if (contractAddress) {
      return new Contract(contractAddress, PSM_ABI).connect(signer)
    }
  },
)

export const contractsSelectors = {
  vault,
  oracle,
  addressBatchBalances,
  poolHelpers,
  tokenConnector,
  errorMessage,
  crossChainRouter,
  crossChainTokenConnector,
  axonCrossChainRouter,
  crossChainRouterAddress,
  axonCrossChainRouterAddress,
  currentNetworkRouterAddress,
  vortex,
  psm,
}
