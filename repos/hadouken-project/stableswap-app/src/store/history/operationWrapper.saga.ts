import { Effect, StrictEffect } from 'redux-saga/effects'
import { SagaGenerator, put } from 'typed-redux-saga'

import { ContractTransaction } from '@ethersproject/contracts'

import { historyActions } from './history.slice'

export function* operationWrapper(
  transactionId: string,
  operationId: string,
  effect: SagaGenerator<Generator, Effect> | Generator<Effect>,
): Generator<typeof effect | StrictEffect, ContractTransaction | undefined> {
  try {
    yield* put(
      historyActions.setOperationPending({
        transactionId,
        operationId,
      }),
    )

    const transaction = yield effect

    yield* put(
      historyActions.setOperationSuccess({
        transactionId,
        operationId,
      }),
    )
    return transaction as ContractTransaction
  } catch (error) {
    if (transactionId) {
      yield* put(
        historyActions.setOperationFailure({
          transactionId: transactionId,
        }),
      )
    }
    console.error(error)

    throw new Error(error)
  }
}
