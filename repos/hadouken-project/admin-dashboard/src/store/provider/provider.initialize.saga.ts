import { StrictEffect } from 'redux-saga/effects'
import { call, put } from 'typed-redux-saga'

import { getProvider } from '@hadouken-project/lending-contracts'
import { getAppConfig } from '@utils/config'
import { CONTRACTS_CONFIG } from '@utils/stringOperations'

import { providerActions } from './provider.slice'

export function* initializeProviderSaga(): Generator {
  // try {
  //   const provider = yield* call(getMetamaskProvider)
  //   if (provider) {
  yield* put(providerActions.initializeProviderSuccess())
  //   }
  // } catch (error) {
  //   yield* put(providerActions.initializeProviderFailure())
  //   console.error(error)
  // }
}

/**
 * Polyjuice Provider initializer. Required status succes to perform contract call's
 * @todo Split the logic of provider init and wallet state
 * @todo Wny process of AddressProvider init is in polyjuice provider init? Where to move?
 * @todo Handle provider init failure from UI perspective
 */
export function* initializePolyjuiceProviderSaga(): Generator<
  StrictEffect,
  boolean
> {
  try {
    const appConfig = getAppConfig()
    const providerSelector = yield* call(getProvider, appConfig.chain)

    const web3Provider = providerSelector(CONTRACTS_CONFIG, true)

    const network = yield* call(() => web3Provider.ready)

    if (network.chainId) {
      yield* put(providerActions.initializeProviderSuccess())
    }
  } catch (error) {
    yield* put(providerActions.initializeProviderFailure())
    console.error(error)
    return false
  }

  return true
}
