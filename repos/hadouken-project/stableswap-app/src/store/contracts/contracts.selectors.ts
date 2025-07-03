import { getBackstopEnvironment, getLendingEnvironment } from '@config'
import { getConnect as getBackstopConnect } from '@hadouken-project/backstop'
import { getConnect } from '@hadouken-project/lending-contracts'
import {
  AddressBalances,
  AddressBalances__factory,
  BalancerHelpers,
  BalancerHelpers__factory,
  BalancerRelayer,
  BalancerRelayer__factory,
  BasePool,
  BasePool__factory,
  DIAOracleV2,
  DIAOracleV2__factory,
  ERC20,
  ERC20__factory,
  HadoukenLockdrop,
  HadoukenLockdrop__factory,
  ProtocolFeePercentagesProvider__factory,
  StaticATokenLM,
  StaticATokenLM__factory,
  Vault,
  Vault__factory,
} from '@hadouken-project/typechain'
import { createSelector } from '@reduxjs/toolkit'
import { networkSelectors } from '@store/network/network.selector'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { getDeploymentConfig, getExternal } from '../../utils/network'
import { providerSelector } from '../provider/provider.selector'

const vault = createSelector(
  [
    providerSelector.provider,
    providerSelector.fallbackProvider,
    walletSelectors.isConnected,
    networkSelectors.applicationChainId,
  ],
  (provider, fallbackProvider, isConnected, chainId) => {
    let vault: Vault | null = null

    if (!chainId) return null

    const VaultAddress = getDeploymentConfig(chainId).Vault
    if (provider && isConnected) {
      const signer = provider.getSigner()
      vault = Vault__factory.connect(VaultAddress, signer)
    } else {
      vault = Vault__factory.connect(VaultAddress, fallbackProvider)
    }

    return vault
  },
)

const batchRelayer = createSelector(
  [
    providerSelector.provider,
    providerSelector.fallbackProvider,
    walletSelectors.isConnected,
    networkSelectors.applicationChainId,
  ],
  (provider, fallbackProvider, isConnected, chainId) => {
    let batchRelayer: BalancerRelayer | null = null

    if (!chainId) return null

    const BatchRelayerAddress = getDeploymentConfig(chainId).BatchRelayer
    if (provider && isConnected) {
      const signer = provider.getSigner()
      batchRelayer = BalancerRelayer__factory.connect(
        BatchRelayerAddress,
        signer,
      )
    } else {
      batchRelayer = BalancerRelayer__factory.connect(
        BatchRelayerAddress,
        fallbackProvider,
      )
    }

    return batchRelayer
  },
)

const oracle = createSelector(
  [
    providerSelector.provider,
    providerSelector.fallbackProvider,
    walletSelectors.isConnected,
    networkSelectors.applicationChainId,
  ],
  (provider, fallbackProvider, isConnected, chainId) => {
    let oracle: DIAOracleV2 | null = null

    if (!chainId) return null

    const DIAOracleV2Address = getExternal(chainId).DIAOracleV2
    if (provider && isConnected) {
      const signer = provider.getSigner()
      oracle = DIAOracleV2__factory.connect(DIAOracleV2Address, signer)
    } else {
      oracle = DIAOracleV2__factory.connect(
        DIAOracleV2Address,
        fallbackProvider,
      )
    }

    return oracle
  },
)

const addressBatchBalances = createSelector(
  [
    providerSelector.provider,
    providerSelector.fallbackProvider,
    walletSelectors.isConnected,
    networkSelectors.applicationChainId,
  ],
  (provider, fallbackProvider, isConnected, chainId) => {
    let addressBalances: AddressBalances | null = null

    if (!chainId) return null

    const AddressBalancesAddress = getDeploymentConfig(chainId).AddressBalances
    if (provider && isConnected) {
      const signer = provider.getSigner()

      addressBalances = AddressBalances__factory.connect(
        AddressBalancesAddress,
        signer,
      )
    } else {
      addressBalances = AddressBalances__factory.connect(
        AddressBalancesAddress,
        fallbackProvider,
      )
    }
    return addressBalances
  },
)

const protocolFeePercentageProvider = createSelector(
  [
    providerSelector.provider,
    providerSelector.fallbackProvider,
    walletSelectors.isConnected,
    networkSelectors.applicationChainId,
  ],
  (provider, fallbackProvider, isConnected, chainId) => {
    if (!chainId) return null

    const ProtocolFeePercentagesProviderAddress = getDeploymentConfig(chainId)
      .ProtocolFeePercentagesProvider
    if (provider && isConnected) {
      const signer = provider.getSigner()

      return ProtocolFeePercentagesProvider__factory.connect(
        ProtocolFeePercentagesProviderAddress,
        signer,
      )
    }

    return ProtocolFeePercentagesProvider__factory.connect(
      ProtocolFeePercentagesProviderAddress,
      fallbackProvider,
    )
  },
)

const poolConnector = createSelector(
  [
    providerSelector.provider,
    providerSelector.fallbackProvider,
    walletSelectors.isConnected,
  ],
  (provider, fallbackProvider, isConnected) => {
    if (provider && isConnected) {
      const signer = provider.getSigner()
      return (poolAddress: string) => {
        const pool: BasePool = BasePool__factory.connect(poolAddress, signer)

        return pool
      }
    } else {
      return (poolAddress: string) => {
        const pool: BasePool = BasePool__factory.connect(
          poolAddress,
          fallbackProvider,
        )

        return pool
      }
    }
  },
)

const staticATokenConnector = createSelector(
  [
    providerSelector.provider,
    providerSelector.fallbackProvider,
    walletSelectors.isConnected,
  ],
  (provider, fallbackProvider, isConnected) => {
    if (provider && isConnected) {
      const signer = provider.getSigner()
      return (tokenAddress: string) => {
        const staticAToken: StaticATokenLM = StaticATokenLM__factory.connect(
          tokenAddress,
          signer,
        )

        return staticAToken
      }
    } else {
      return (tokenAddress: string) => {
        const staticAToken: StaticATokenLM = StaticATokenLM__factory.connect(
          tokenAddress,
          fallbackProvider,
        )

        return staticAToken
      }
    }
  },
)

const tokenConnector = createSelector(
  [
    providerSelector.provider,
    providerSelector.fallbackProvider,
    walletSelectors.isConnected,
  ],
  (provider, fallbackProvider, isConnected) => {
    if (provider && isConnected) {
      const signer = provider.getSigner()
      return (tokenAddress: string) => {
        const erc20: ERC20 = ERC20__factory.connect(tokenAddress, signer)

        return erc20
      }
    } else {
      return (tokenAddress: string) => {
        const erc20: ERC20 = ERC20__factory.connect(
          tokenAddress,
          fallbackProvider,
        )

        return erc20
      }
    }
  },
)

const lockDropConnector = createSelector(
  [
    providerSelector.provider,
    providerSelector.fallbackProvider,
    walletSelectors.isConnected,
    networkSelectors.applicationChainId,
  ],
  (provider, fallbackProvider, isConnected, chainId) => {
    if (!chainId) return null

    const lockdropContractAddress = getDeploymentConfig(chainId)
      .HadoukenLockdrop

    let lockDrop: HadoukenLockdrop | null = null

    if (provider && isConnected) {
      const signer = provider.getSigner()

      lockDrop = HadoukenLockdrop__factory.connect(
        lockdropContractAddress,
        signer,
      )
    } else {
      lockDrop = HadoukenLockdrop__factory.connect(
        lockdropContractAddress,
        fallbackProvider,
      )
    }
    return lockDrop
  },
)

const lendingContracts = createSelector(
  [
    providerSelector.provider,
    providerSelector.fallbackProvider,
    walletSelectors.isConnected,
    networkSelectors.applicationChainId,
  ],
  (provider, fallbackProvider, isConnected, chainId) => {
    if (provider && chainId && isConnected) {
      const signer = provider.getSigner()
      return getConnect(chainId)?.(signer, getLendingEnvironment())
    } else {
      return getConnect(chainId ?? '')?.(
        fallbackProvider,
        getLendingEnvironment(),
      )
    }
  },
)

const backstopContracts = createSelector(
  [
    providerSelector.provider,
    providerSelector.fallbackProvider,
    walletSelectors.isConnected,
    networkSelectors.applicationChainId,
  ],
  (provider, fallbackProvider, isConnected, chainId) => {
    if (!chainId) return null

    const env = getBackstopEnvironment()

    if (provider && isConnected) {
      const signer = provider.getSigner()

      return getBackstopConnect(chainId)(
        signer,
        env === 'localhost' ? 'testnet' : env,
        chainId,
      )
    } else {
      return getBackstopConnect(chainId)(
        fallbackProvider,
        env === 'localhost' ? 'testnet' : env,
        chainId,
      )
    }
  },
)

const poolHelpers = createSelector(
  [
    providerSelector.provider,
    providerSelector.fallbackProvider,
    walletSelectors.isConnected,
    networkSelectors.applicationChainId,
  ],
  (provider, fallbackProvider, isConnected, chainId) => {
    if (!chainId) return null

    const BalancerHelpersAddress = getDeploymentConfig(chainId).BalancerHelpers
    if (provider && isConnected) {
      const signer = provider.getSigner()
      const poolHelpers: BalancerHelpers = BalancerHelpers__factory.connect(
        BalancerHelpersAddress,
        signer,
      )

      return poolHelpers
    } else {
      const poolHelpers: BalancerHelpers = BalancerHelpers__factory.connect(
        BalancerHelpersAddress,
        fallbackProvider,
      )

      return poolHelpers
    }
  },
)

const errorMessage = createSelector(
  [selectReducer(StoreKeys.Contracts)],
  (contractsState) => contractsState.errorMessage,
)

const actionInProgress = createSelector(
  [selectReducer(StoreKeys.Contracts)],
  (contractsState) => contractsState.actionInProgress,
)

export const contractsSelectors = {
  actionInProgress,
  vault,
  batchRelayer,
  oracle,
  poolConnector,
  addressBatchBalances,
  poolHelpers,
  tokenConnector,
  lendingContracts,
  backstopContracts,
  errorMessage,
  protocolFeePercentageProvider,
  staticATokenConnector,
  lockDropConnector,
}
