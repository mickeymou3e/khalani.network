import { StrictEffect } from 'redux-saga/effects'
import { apply, call, put, select } from 'typed-redux-saga'

import { providerSelectors } from '@store/provider/provider.selectors'
import { getMetamaskProvider } from '@store/wallet/wallet.utils'

import { networkActions } from '../network.slice'

export function* updateNetworkSaga(): Generator {
  const provider = yield* call(getMetamaskProvider)
  const chainId = provider.chainId
  const network = chainId
  yield* put(networkActions.updateNetwork(network))
}

export function* updateLatestBlockSaga(): Generator {
  const provider = yield* select(providerSelectors.provider)
  const latestBlock = yield* apply(provider, provider.getBlockNumber, [])

  yield* put(networkActions.updateLatestBlock(latestBlock))
}

export function* initNetwork(): Generator<StrictEffect, boolean> {
  try {
    yield* call(updateLatestBlockSaga)
    yield* call(updateNetworkSaga)

    yield* put(networkActions.initializeNetworkSuccess())
  } catch (error) {
    console.error(error)
    yield* put(networkActions.initializeNetworkFailure())
    return false
  }

  return true
}
