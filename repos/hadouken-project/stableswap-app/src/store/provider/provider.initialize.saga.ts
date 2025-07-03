import { providers } from 'ethers'
import { AddressTranslator } from 'nervos-godwoken-integration'
import { StrictEffect } from 'redux-saga/effects'
import { apply, call, put, select } from 'typed-redux-saga'

import { getChainConfig } from '@config'
import { Environment } from '@hadouken-project/config'
import { providerSelector } from '@store/provider/provider.selector'

import { env } from '../../utils/network'
import { providerActions } from './provider.slice'

/**
 * TODO:
 * How Provider and MetamaskProviders are related to each other, why there are have no
 * dependency relation?
 * Where initializeMetamaskProviderSaga and state change's it produce are used?
 * Should all addresses be calculated on frontend?
 */

const ETHERS_ISSUE_866 = 'any'
export const getProvider = (
  externalProvider: providers.ExternalProvider,
): providers.Web3Provider => {
  const provider = new providers.Web3Provider(
    externalProvider,
    ETHERS_ISSUE_866,
  )

  return provider
}

/**
 * TODO:
 * Do provider.ready check satisfies and guarantee that provider is able to perform calls on
 * target chain?
 */
export function* initializeProviderSaga(
  externalProvider: providers.ExternalProvider,
): Generator<StrictEffect, providers.Web3Provider | null> {
  try {
    const provider = yield* call(getProvider, externalProvider)

    const network = yield* call(() => provider.ready)
    if (network.chainId) {
      yield* put(providerActions.initializeProviderSuccess(provider))
    }

    return provider
  } catch (error) {
    yield* put(providerActions.initializeProviderFailure())
    console.error(error)
    return null
  }
}

export const getWebsocketProvider = (
  chainId: string,
): providers.WebSocketProvider => {
  const config = getChainConfig(chainId)
  const wsProvider = new providers.WebSocketProvider(
    config.wsUrl,
    Number(config.chainId),
  )

  return wsProvider
}

export const getAddressTranslator = (chainId: string): AddressTranslator => {
  const translatorEnv = (() => {
    if (env === Environment.Mainnet) {
      return 'mainnet'
    } else {
      return 'testnet'
    }
  })()
  const config = getChainConfig(chainId)
  return new AddressTranslator(translatorEnv, {
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

export function* initializeAddressTranslatorSaga(): Generator<
  StrictEffect,
  boolean
> {
  try {
    const addressTranslator = yield* select(providerSelector.addressTranslator)
    if (addressTranslator) {
      yield* apply(addressTranslator, addressTranslator.init, [])
    }
  } catch (error) {
    console.error(error)
    return false
  }

  return true
}
