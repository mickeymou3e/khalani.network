import { ContractTransaction } from 'ethers'
import { Effect, StrictEffect } from 'redux-saga/effects'
import { put, SagaGenerator } from 'typed-redux-saga'

import { historyActions } from './history.slice'

export function* operationWrapper(
  transactionId: string | null,
  effect: SagaGenerator<Generator, Effect> | Generator<Effect>,
): Generator<typeof effect | StrictEffect, ContractTransaction> {
  if (transactionId) {
    yield* put(
      historyActions.setOperationPending({
        transactionId: transactionId,
      }),
    )
  }

  const transaction = yield effect
  if (transactionId) {
    yield* put(
      historyActions.setOperationSuccess({
        transactionId: transactionId,
      }),
    )
  }

  return transaction as ContractTransaction
}
