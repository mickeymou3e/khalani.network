import { StrictEffect } from 'redux-saga/effects'
import { apply, select } from 'typed-redux-saga'

import { contractsSelectors } from '@store/provider/provider.selector'
import { ENVIRONMENT } from '@utils/stringOperations'

export function* initializeAddressTranslator(): Generator<
  StrictEffect,
  boolean
> {
  try {
    const godwokenAddressTranslator = yield* select(
      contractsSelectors.godwokenAddressTranslator,
    )

    if (godwokenAddressTranslator) {
      yield* apply(godwokenAddressTranslator, godwokenAddressTranslator.init, [
        ENVIRONMENT === 'mainnet' ? 'mainnet' : 'testnet',
      ])

      yield* apply(
        godwokenAddressTranslator,
        godwokenAddressTranslator.connectWallet,
        [],
      )
    }
  } catch (exception) {
    console.error(exception)
    return false
  }

  return true
}
