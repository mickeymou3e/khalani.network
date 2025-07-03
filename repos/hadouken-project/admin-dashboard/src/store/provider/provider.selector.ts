import { AddressTranslator } from 'nervos-godwoken-integration'

import { RequestStatus } from '@constants/Request'
import {
  Environments,
  getConnect,
  getProvider,
} from '@hadouken-project/lending-contracts'
import { createSelector } from '@reduxjs/toolkit'
import { getAppConfig, getContractsConfig } from '@utils/config'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

const providerReady = createSelector(
  [selectReducer(StoreKeys.Provider)],
  (providerState) => providerState.status === RequestStatus.Resolved,
)

const fallbackProvider = createSelector([], () => {
  const appConfig = getAppConfig()

  return getProvider(appConfig.chain)(
    appConfig.contractsEnv as Environments,
    true,
  )
})

/**
 * AddressTranslator to obtain Godwoken addresses from Ethereum addresses
 */
const addressTranslator = createSelector(
  [fallbackProvider],
  (fallbackProvider) => {
    if (fallbackProvider) {
      const config = getContractsConfig()

      return new AddressTranslator({
        CKB_URL: config.nervos?.ckb.url ?? '',
        RPC_URL: config.rpcUrl,
        INDEXER_URL: config.nervos?.indexer.url ?? '',
        deposit_lock_script_type_hash:
          config.nervos?.deposit_lock_script_type_hash ?? '',
        eth_account_lock_script_type_hash:
          config.nervos?.eth_account_lock_hash ?? '',
        rollup_type_script: {
          code_hash: config.nervos?.rollup_type_script.code_hash ?? '',
          hash_type: config.nervos?.rollup_type_script.hash_type ?? '',
          args: config.nervos?.rollup_type_script.args ?? '',
        },
        rollup_type_hash: config.nervos?.rollup_type_hash ?? '',
        rc_lock_script_type_hash: config.nervos?.rc_lock_script_type_hash ?? '',
      })
    }
    return null
  },
)

const contracts = createSelector([fallbackProvider], (fallbackProvider) => {
  const appConfig = getAppConfig()

  return getConnect(appConfig.chain)?.(
    fallbackProvider,
    appConfig.contractsEnv as Environments,
    false,
  )
})

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

const uiHelper = createSelector(contracts, (contracts) => contracts?.uiHelper)

export const contractsSelectors = {
  providerReady,
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
  addressTranslator,
  actionInProgress,
  userBalances,
  uiHelper,
  fallbackProvider,
  bammSelector,
}
