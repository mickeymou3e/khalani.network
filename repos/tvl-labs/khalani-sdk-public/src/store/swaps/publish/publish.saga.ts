import { StrictEffect } from 'redux-saga/effects'
import { apply, select } from 'typed-redux-saga'
import { handleProviderError } from '@utils/error'
import { khalaniContractsSelectors } from '@store/contracts/khalani.contracts.selectors'
import { Intent } from '../create'

export function* publishIntentSaga(
  intent: Intent,
  intentSignature: string,
): Generator<StrictEffect, void, any> {
  try {
    const intentBook = yield* select(khalaniContractsSelectors.intentBook)
    const mTokenRegistry = yield* select(
      khalaniContractsSelectors.mTokenRegistry,
    )
    const mToken = yield* select(khalaniContractsSelectors.mToken)

    if (!intentBook || !mTokenRegistry || !mToken) {
      throw new Error('IntentBook contract is undefined')
    }

    const addPublisherTx = yield* apply(intentBook, intentBook.addPublisher, [
      intent.author,
    ])

    yield* apply(addPublisherTx, addPublisherTx.wait, [])

    // const isValidMToken = yield* apply(
    //   mTokenRegistry,
    //   mTokenRegistry.checkValidMToken,
    //   [intent.srcMToken],
    // )

    const mTokenBalance = yield* apply(mToken, mToken.balanceOf, [
      '0xc13113E56E00050327Be3AD164185103541f1903',
    ])

    yield* apply(intentBook, intentBook.publishIntent, [
      { intent, signature: intentSignature },
    ])

    console.log('Publish intent success')
  } catch (error) {
    handleProviderError(error)
  }
}
