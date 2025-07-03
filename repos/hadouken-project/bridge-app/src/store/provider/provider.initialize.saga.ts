import { StrictEffect } from 'redux-saga/effects'
import { put, apply, select } from 'typed-redux-saga'

import { providerSelectors } from './provider.selectors'
import { providerActions } from './provider.slice'

export function* initializeProviderSaga(): Generator<StrictEffect, boolean> {
  try {
    const web3Provider = yield* select(providerSelectors.provider)

    const network = yield* apply(web3Provider, web3Provider.getNetwork, [])

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

export function* initializeAddressTranslatorSaga(): Generator<
  StrictEffect,
  boolean
> {
  try {
    const addressTranslator = yield* select(providerSelectors.addressTranslator)

    yield* apply(addressTranslator, addressTranslator.init, [])
  } catch (exception) {
    console.error(exception)
    return false
  }

  return true
}
