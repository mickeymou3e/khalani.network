import { StrictEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { networkSelectors } from '@store/network/network.selector'

import {
  fetchMetaMaskConnectedAccount,
  getMetamaskProvider,
} from '../wallet.utils'

export function* checkMetaMaskInstalled(): Generator<StrictEffect, boolean> {
  try {
    yield* call(getMetamaskProvider)
    return true
  } catch (exception) {
    return false
  }
}

export function* checkUserAuthentication(): Generator<StrictEffect, boolean> {
  try {
    const metaMaskProvider = yield* call(getMetamaskProvider)

    const connectedAccount = yield* call(
      fetchMetaMaskConnectedAccount,
      metaMaskProvider,
    )

    if (connectedAccount) {
      return true
    } else {
      return false
    }
  } catch (_exception) {
    return false
  }
}

export function* checkNetwork(): Generator<StrictEffect, boolean> {
  try {
    const isCorrectNetwork = yield* select(networkSelectors.isCorrectNetwork)

    return isCorrectNetwork
  } catch {
    return false
  }
}
