import { ContractTransaction } from 'ethers'
import { Effect, StrictEffect } from 'redux-saga/effects'
import { put, SagaGenerator } from 'typed-redux-saga'

import { historyActions } from './history.slice'

export function* operationWrapper(
  transactionId: string,
  effect: SagaGenerator<Generator, Effect> | Generator<Effect>,
): Generator<typeof effect | StrictEffect, ContractTransaction> {
  yield* put(
    historyActions.setOperationPending({
      transactionId: transactionId,
    }),
  )

  const transaction = yield effect

  yield* put(
    historyActions.setOperationSuccess({
      transactionId: transactionId,
    }),
  )

  return transaction as ContractTransaction
}
