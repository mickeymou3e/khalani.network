import { Contract } from 'ethers'

import config from '@config'
import {
  AddressBalances,
  connectAddressBalances,
  connectERC20,
  connectOracle,
  connectPoolHelpers,
  connectStablePool,
  connectVault,
  DIAOracleV2,
  ERC20,
  PoolHelpers,
  StablePool,
  Vault,
} from '@hadouken-project/swap-contracts-v2'
import { createSelector } from '@reduxjs/toolkit'
import { CROSS_CHAIN_ROUTER_ABI } from '@services/pools/CrossChainRouterArtifact'
import { networkSelectors } from '@store/network/network.selector'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

import { providerSelector } from '../provider/provider.selector'

const vault = createSelector(
  [providerSelector.balancerChainSigner],
  (signer) => {
    let vault: Vault | null = null
    if (signer) {
      vault = connectVault(config.contracts.Vault, signer)
    }

    return vault
  },
)

const oracle = createSelector(
  [providerSelector.balancerChainSigner],
  (signer) => {
    let oracle: DIAOracleV2 | null = null
    if (signer) {
      oracle = connectOracle(config.contracts.Oracle, signer)
    }

    return oracle
  },
)

const addressBatchBalances = createSelector(
  [providerSelector.balancerChainSigner],
  (signer) => {
    let addressBalances: AddressBalances | null = null
    if (signer) {
      addressBalances = connectAddressBalances(
        config.contracts.AddressBalances,
        signer,
      )
    }
    return addressBalances
  },
)

const poolConnector = createSelector(
  [providerSelector.balancerChainSigner],
  (signer) => {
    if (signer) {
      return (poolAddress: string) => {
        const pool: StablePool = connectStablePool(poolAddress, signer)

        return pool
      }
    }
  },
)

const tokenConnector = createSelector(
  [providerSelector.balancerChainSigner],
  (signer) => {
    if (signer) {
      return (tokenAddress: string) => {
        const erc20: ERC20 = connectERC20(tokenAddress, signer)
        return erc20
      }
    }
  },
)

const crossChainTokenConnector = createSelector(
  [providerSelector.provider],
  (provider) => {
    if (provider) {
      const signer = provider.getSigner()
      return (tokenAddress: string) => {
        const erc20: ERC20 = connectERC20(tokenAddress, signer)
        return erc20
      }
    }
  },
)

const poolHelpers = createSelector(
  [providerSelector.balancerChainSigner],
  (signer) => {
    if (signer) {
      const poolHelpers: PoolHelpers = connectPoolHelpers(
        config.contracts.PoolsHelpers,
        signer,
      )

      return poolHelpers
    }
  },
)

const crossChainRouter = createSelector(
  [providerSelector.provider, networkSelectors.network],
  (provider, network) => {
    if (provider && network) {
      const signer = provider.getSigner()

      const contractAddress = (config.contracts.CrossChainRouter as {
        [key: string]: string | undefined
      })[network]

      if (contractAddress) {
        return new Contract(contractAddress, CROSS_CHAIN_ROUTER_ABI).connect(
          signer,
        )
      }
    }
  },
)

const errorMessage = createSelector(
  [selectReducer(StoreKeys.Contracts)],
  (contractsState) => contractsState.errorMessage,
)
export const contractsSelectors = {
  vault,
  oracle,
  poolConnector,
  addressBatchBalances,
  poolHelpers,
  tokenConnector,
  errorMessage,
  crossChainRouter,
  crossChainTokenConnector,
}
