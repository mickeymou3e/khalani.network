import { StrictEffect } from 'redux-saga/effects'
import { call, put } from 'typed-redux-saga'

import { walletActions } from '../wallet.slice'
import { getMetamaskProviderSaga } from '../wallet.utils'

export function* initializeNetwork(): Generator<StrictEffect, boolean> {
  try {
    const provider = yield* call(getMetamaskProviderSaga)
    const chainId = provider?.chainId

    if (chainId) {
      yield* put(walletActions.onNetworkChange(chainId))
    }

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
