import { StrictEffect } from 'redux-saga/effects'
import { put } from 'typed-redux-saga'
import { v4 as uuid } from 'uuid'

import { historyActions } from '@store/history/history.slice'
import {
  IContractOperation,
  TransactionStatus,
  TransactionType,
} from '@store/history/history.types'
import { createClaimOperation } from '@store/history/history.utils'

export function* createClaimPlan(): Generator<
  StrictEffect,
  {
    transactionId: string
    operationId: string
  }
> {
  const operations: IContractOperation[] = []

  operations.push(createClaimOperation())

  const transactionId = uuid()

  yield* put(
    historyActions.addTransaction({
      id: transactionId,
      type: TransactionType.Claim,
      operations: operations,
      status: TransactionStatus.Pending,
    }),
  )

  return {
    transactionId,
    operationId: operations[0].id,
  }
}
