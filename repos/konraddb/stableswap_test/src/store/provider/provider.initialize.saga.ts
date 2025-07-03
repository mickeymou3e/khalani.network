import { providers } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call, put } from 'typed-redux-saga'

import config from '@config'

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

export const getWebsocketProvider = (): providers.WebSocketProvider => {
  const wsProvider = new providers.WebSocketProvider(
    config.godwoken.wsUrl,
    Number(config.godwoken.chainId),
  )

  return wsProvider
}
