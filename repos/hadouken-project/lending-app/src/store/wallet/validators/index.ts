import { StrictEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { walletSelectors } from '@store/wallet/wallet.selector'

import {
  fetchMetaMaskConnectedAccount,
  getMetamaskProviderSaga,
} from '../wallet.utils'

export function* checkMetaMaskInstalled(): Generator<StrictEffect, boolean> {
  try {
    return true
  } catch (exception) {
    return false
  }
}

export function* checkUserAuthentication(): Generator<StrictEffect, boolean> {
  try {
    const metaMaskProvider = yield* call(getMetamaskProviderSaga)

    if (!metaMaskProvider) return false

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
    const applicationChainId = yield* select(walletSelectors.applicationChainId)
    const walletChainId = yield* select(walletSelectors.walletChainId)

    return applicationChainId === walletChainId
  } catch (_exception) {
    return false
  }
}
