import { StrictEffect } from 'redux-saga/effects'
import { apply, call, put, select } from 'typed-redux-saga'

import { contractsSelectors } from '@store/provider/provider.selector'

import { walletActions } from './wallet.slice'
import {
  fetchMetaMaskConnectedAccount,
  getMetamaskProviderSaga,
} from './wallet.utils'

export function* initializeWalletSaga(): Generator<StrictEffect, boolean> {
  try {
    const ethereum = yield* call(getMetamaskProviderSaga)

    const ethereumAddress = ethereum?.isMetaMask
      ? yield* call(fetchMetaMaskConnectedAccount, ethereum)
      : null

    if (!ethereumAddress) {
      yield* put(
        walletActions.initializeWalletSuccess({
          ethAddress: undefined,
          ckbAddress: undefined,
        }),
      )
    } else {
      let ckbAddress = ''

      const godwokenAddressTranslator = yield* select(
        contractsSelectors.godwokenAddressTranslator,
      )

      if (godwokenAddressTranslator) {
        ckbAddress = yield* apply(
          godwokenAddressTranslator,
          godwokenAddressTranslator.ethAddressToCkbAddress,
          [ethereumAddress],
        )
      }

      yield* put(
        walletActions.initializeWalletSuccess({
          ethAddress: ethereumAddress,
          ckbAddress: ckbAddress,
        }),
      )
    }
  } catch (error) {
    yield* put(walletActions.initializeWalletFailure())
    console.error(error)
    return false
  }

  return true
}
