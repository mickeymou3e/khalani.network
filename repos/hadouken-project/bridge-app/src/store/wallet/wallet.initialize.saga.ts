import { StrictEffect } from 'redux-saga/effects'
import { put, call, select, apply } from 'typed-redux-saga'

import { providerSelectors } from '@store/provider/provider.selectors'

import { walletActions } from './wallet.slice'
import {
  fetchMetaMaskConnectedAccount,
  getMetamaskProvider,
} from './wallet.utils'

export function* initializeWalletSaga(): Generator<StrictEffect, boolean> {
  try {
    const ethereum = yield* call(getMetamaskProvider)

    const ethereumAddress = ethereum?.isMetaMask
      ? yield* call(fetchMetaMaskConnectedAccount, ethereum)
      : null

    if (!ethereumAddress) {
      yield* put(
        walletActions.initializeWalletSuccess({
          ethAddress: undefined,
          ckbAddress: undefined,
          chainId: undefined,
          nativeTokenBalance: null,
        }),
      )
    } else {
      const godwokenAddressTranslator = yield* select(
        providerSelectors.addressTranslator,
      )
      const ckbAddress = godwokenAddressTranslator?.ethAddressToCkbAddress(
        ethereumAddress,
      )

      const provider = yield* select(providerSelectors.provider)
      const nativeTokenBalance = yield* apply(provider, provider.getBalance, [
        ethereumAddress,
      ])

      yield* put(
        walletActions.initializeWalletSuccess({
          ethAddress: ethereumAddress,
          ckbAddress: ckbAddress,
          chainId: ethereum?.chainId?.toString(),
          nativeTokenBalance: nativeTokenBalance,
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
