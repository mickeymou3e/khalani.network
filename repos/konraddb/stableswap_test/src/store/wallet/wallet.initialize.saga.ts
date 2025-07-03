import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { apply, call, put, select } from 'typed-redux-saga'

import { providerSelector } from '@store/provider/provider.selector'

import { walletActions } from './wallet.slice'
import {
  fetchMetaMaskConnectedAccount,
  getMetaMaskProvider,
  getProviderNetwork,
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
          chainId: null,
          nativeTokenBalance: null,
        }),
      )
    } else {
      const chainId = yield* call(getProviderNetwork)
      const provider = yield* select(providerSelector.provider)
      const addressTranslator = yield* select(
        providerSelector.addressTranslator,
      )

      const nativeTokenBalance = provider
        ? yield* apply(provider, provider.getBalance, [ethereumAddress])
        : BigNumber.from(0)

      let ckbAddress = null
      if (addressTranslator) {
        ckbAddress = 'asdfasdfasd'
      }

      yield* put(
        walletActions.initializeWalletSuccess({
          ethAddress: ethereumAddress,
          godwokenShortAddress: ethereumAddress,
          ckbAddress: ckbAddress,
          chainId: chainId,
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
