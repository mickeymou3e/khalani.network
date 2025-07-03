import { AddressTranslator } from 'nervos-godwoken-integration'

import { RequestStatus } from '@constants/Request'
import {
  getConfig,
  getConnect,
  getProvider,
  getWebsocketProvider,
  isGodwokenNetwork,
} from '@hadouken-project/lending-contracts'
import { createSelector } from '@reduxjs/toolkit'
import { walletSelectors } from '@store/wallet/wallet.selector'
import {
  getEthereumWeb3Provider,
  getMetaMaskProvider,
} from '@store/wallet/wallet.utils'
import { ENVIRONMENT } from '@utils/stringOperations'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

const providerReady = createSelector(
  [selectReducer(StoreKeys.Provider)],
  (providerState) => providerState.status === RequestStatus.Resolved,
)

const provider = createSelector([], () => getEthereumWeb3Provider())

const fallbackProvider = createSelector(
  [walletSelectors.applicationChainId],
  (applicationChainId) => getProvider(applicationChainId)(ENVIRONMENT, true),
)

const wsProvider = createSelector(
  [providerReady, walletSelectors.applicationChainId],
  (providerReady, applicationChainId) => {
    const metaMaskProvider = getMetaMaskProvider()
    if (providerReady && metaMaskProvider) {
      const wsProvider = getWebsocketProvider(applicationChainId)(ENVIRONMENT)
      return wsProvider
    }
    return null
  },
)

/**
 * AddressTranslator to obtain Godwoken addresses from Ethereum addresses
 */
const godwokenAddressTranslator = createSelector(
  [provider, walletSelectors.applicationChainId],
  (provider, applicationChainId) => {
    if (provider && isGodwokenNetwork(applicationChainId)) {
      const config = getConfig(applicationChainId)?.(ENVIRONMENT)

      return new AddressTranslator({
        CKB_URL: config?.nervos?.ckb.url ?? '',
        RPC_URL: config?.rpcUrl ?? '',
        INDEXER_URL: config?.nervos?.indexer.url ?? '',
        deposit_lock_script_type_hash:
          config?.nervos?.deposit_lock_script_type_hash ?? '',
        eth_account_lock_script_type_hash:
          config?.nervos?.eth_account_lock_hash ?? '',
        rollup_type_script: {
          code_hash: config?.nervos?.rollup_type_script.code_hash ?? '',
          hash_type: config?.nervos?.rollup_type_script.hash_type ?? '',
          args: config?.nervos?.rollup_type_script.args ?? '',
        },
        rollup_type_hash: config?.nervos?.rollup_type_hash ?? '',
        rc_lock_script_type_hash:
          config?.nervos?.rc_lock_script_type_hash ?? '',
      })
    }
    return null
  },
)

const contracts = createSelector(
  [
    provider,
    fallbackProvider,
    walletSelectors.isConnected,
    walletSelectors.ethAddress,
    walletSelectors.applicationChainId,
    walletSelectors.walletChainId,
  ],
  (
    provider,
    fallbackProvider,
    isConnected,
    ethAddress,
    applicationChainId,
    walletChainId,
  ) => {
    if (!provider && !fallbackProvider) return null

    if (isConnected && ethAddress && provider && walletChainId) {
      const signer = provider.getSigner(ethAddress)

      return getConnect(walletChainId)?.(signer, ENVIRONMENT)
    }

    return getConnect(applicationChainId.toString())?.(
      fallbackProvider,
      ENVIRONMENT,
    ) // TODO resolve type conflict
  },
)

const addressProvider = createSelector(
  contracts,
  (contracts) => contracts?.addressProvider,
)

const pool = createSelector(
  contracts,
  (contracts) => contracts?.pool ?? undefined,
)

const registry = createSelector(contracts, (contracts) => contracts?.registry)

const hadoukenOracle = createSelector(
  contracts,
  (contracts) => contracts?.hadoukenOracle,
)

const oracleProvider = createSelector(
  contracts,
  (contracts) => contracts?.OracleDiaProvider,
)

const fallbackOracleProvider = createSelector(
  contracts,
  (contracts) => contracts?.oracleBandProvider,
)

const diaOracle = createSelector(contracts, (contracts) => contracts?.diaOracle)

const stdReference = createSelector(
  contracts,
  (contracts) => contracts?.stdReference,
)

const ercSelector = createSelector(contracts, (contracts) => contracts?.token)

const stableDebtToken = createSelector(
  contracts,
  (contracts) => contracts?.stableDebtToken,
)

const variableDebtToken = createSelector(
  contracts,
  (contracts) => contracts?.variableDebtToken,
)

const bammSelector = createSelector(contracts, (contracts) => contracts?.bamm)

const mintSelector = createSelector(
  contracts,
  (contracts) => contracts?.mintToken,
)

const errorMessage = createSelector(
  [selectReducer(StoreKeys.Provider)],
  (providerState) => providerState.errorMessage,
)

const actionInProgress = createSelector(
  [selectReducer(StoreKeys.Provider)],
  (providerState) => providerState.actionInProgress,
)

const userBalances = createSelector(
  contracts,
  (contracts) => contracts?.userBalances,
)

const wEthGateway = createSelector(
  contracts,
  (contracts) => contracts?.wEthGateway,
)

const uiHelper = createSelector(contracts, (contracts) => contracts?.uiHelper)

const latestBlock = createSelector(
  [selectReducer(StoreKeys.Provider)],
  (providerState) => providerState.latestBlock,
)

export const contractsSelectors = {
  providerReady,
  provider,
  wsProvider,
  contracts,
  registry,
  addressProvider,
  pool,
  ercSelector,
  mintSelector,
  errorMessage,
  oracleProvider,
  fallbackOracleProvider,
  hadoukenOracle,
  diaOracle,
  stdReference,
  godwokenAddressTranslator,
  actionInProgress,
  userBalances,
  uiHelper,
  fallbackProvider,
  bammSelector,
  latestBlock,
  wEthGateway,
  stableDebtToken,
  variableDebtToken,
}
