import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'
import { ethers } from 'ethers'
import {
  EthersAdapter,
  EthersAdapterConfig,
  SafeFactoryConfig,
} from '@safe-global/protocol-kit'
import { providerSelector } from '@store/provider/provider.selector'
import { Network } from '@constants/Networks'
import config from '@config'
import { SafeUserConfig } from './safe.types'

const address = createSelector(
  [selectReducer(StoreKeys.Safe)],
  (state) => state.address,
)

const deployed = createSelector(
  [selectReducer(StoreKeys.Safe)],
  (state) => state.deployed,
)

const adapterAddress = createSelector(
  [selectReducer(StoreKeys.Safe)],
  (state) => state.adapterAddress,
)

const ethersAdapter = createSelector(
  [
    providerSelector.signerv5,
    providerSelector.network,
    providerSelector.balancerChainProviderv5,
  ],
  (signer, network, balancerChainProvider) => {
    let signerOrProvider: EthersAdapterConfig['signerOrProvider'] =
      balancerChainProvider

    if (network === Network.Khalani && signer) {
      signerOrProvider = signer
    }

    return new EthersAdapter({
      ethers,
      signerOrProvider,
    })
  },
)

const factoryConfig = createSelector([ethersAdapter], (ethAdapter) => {
  if (ethAdapter) {
    return {
      ethAdapter,
      contractNetworks: {
        [parseInt(Network.Khalani, 16).toString()]: config.contracts.safe,
      },
      isL1SafeMasterCopy: false,
      safeVersion: '1.3.0',
    } as SafeFactoryConfig
  }
})

const defaultConfig = createSelector([providerSelector.userAddress], (eoa) => {
  if (eoa) {
    return {
      owners: [eoa],
      threshold: 1,
      saltNonce: eoa,
    } as SafeUserConfig
  }
})

export const safeSelector = {
  adapterAddress,
  address,
  defaultConfig,
  deployed,
  ethersAdapter,
  factoryConfig,
}
