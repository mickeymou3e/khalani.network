import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { apply, call, put, select } from 'typed-redux-saga'

import { networkSelectors } from '@store/network/network.selector'
import { providerSelector } from '@store/provider/provider.selector'

import { walletActions } from './wallet.slice'
import {
  fetchMetaMaskConnectedAccount,
  getMetaMaskProvider,
} from './wallet.utils'

export function* initializeWalletSaga(): Generator<StrictEffect, boolean> {
  try {
    const ethereum = yield* call(getMetaMaskProvider)

    const ethereumAddress = yield* call(fetchMetaMaskConnectedAccount, ethereum)

    if (!ethereumAddress) {
      yield* put(
        walletActions.initializeWalletSuccess({
          ethAddress: null,
          godwokenShortAddress: null,
          ckbAddress: null,
          nativeTokenBalance: null,
        }),
      )
    } else {
      const provider = yield* select(providerSelector.provider)
      const addressTranslator = yield* select(
        providerSelector.addressTranslator,
      )

      const isExpectedNetwork = yield* select(
        networkSelectors.isExpectedNetwork,
      )

      const nativeTokenBalance =
        provider && isExpectedNetwork
          ? yield* apply(provider, provider.getBalance, [ethereumAddress])
          : BigNumber.from(0)

      let ckbAddress = null
      if (addressTranslator) {
        ckbAddress = yield* apply(
          addressTranslator,
          addressTranslator.ethAddressToCkbAddress,
          [ethereumAddress],
        )
      }

      yield* put(
        walletActions.initializeWalletSuccess({
          ethAddress: ethereumAddress,
          godwokenShortAddress: ethereumAddress,
          ckbAddress: ckbAddress,
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
