import { StrictEffect } from 'redux-saga/effects'
import { put, call, select } from 'typed-redux-saga'

import { getProvider } from '@hadouken-project/lending-contracts'
import { getMetamaskProviderSaga } from '@store/wallet/wallet.utils'
import { ENVIRONMENT } from '@utils/stringOperations'

import { walletSelectors } from '../wallet/wallet.selector'
import { providerActions } from './provider.slice'

export function* initializeProviderSaga(): Generator {
  try {
    const provider = yield* call(getMetamaskProviderSaga)

    if (provider) {
      yield* put(providerActions.initializeProviderSuccess())
    }
  } catch (error) {
    yield* put(providerActions.initializeProviderFailure())
    console.error(error)
  }
}

/**
 * Polyjuice Provider initializer. Required status succes to perform contract call's
 * @todo Split the logic of provider init and wallet state
 * @todo Wny process of AddressProvider init is in polyjuice provider init? Where to move?
 * @todo Handle provider init failure from UI perspective
 */
export function* initializePolyjuiceProviderSaga(): Generator<
  StrictEffect,
  boolean
> {
  try {
    const applicationChainId = yield* select(walletSelectors.applicationChainId)
    const web3Provider = getProvider(applicationChainId)(ENVIRONMENT, false)

    const network = yield* call(() => web3Provider.ready)

    if (network.chainId) {
      yield* put(providerActions.initializeProviderSuccess())
    }
  } catch (error) {
    yield* put(providerActions.initializeProviderFailure())
    console.error(error)
    return false
  }

  return true
}
