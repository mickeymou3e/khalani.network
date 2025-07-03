import { StrictEffect } from 'redux-saga/effects'
import { apply, put } from 'typed-redux-saga'
import { providerActions } from './provider.slice'
import { providers } from 'ethers'

export function* initializeProvider(
  provider: providers.Web3Provider,
): Generator<StrictEffect, void> {
  yield* put(providerActions.initializeProviderRequest())
  try {
    const accounts = yield* apply(provider, provider.listAccounts, [])

    yield* put(providerActions.updateProvider(provider))
    if (accounts.length > 0) {
      yield* put(providerActions.updateAddress(accounts[0]))
    }
    yield* put(providerActions.initializeProviderSuccess())
  } catch (error) {
    console.error(error)
    yield* put(providerActions.initializeProviderFailure())
  }
}
