import { StrictEffect } from 'redux-saga/effects'
import { put } from 'typed-redux-saga'
import { v4 as uuid } from 'uuid'

import { historyActions } from '@store/history/history.slice'
import {
  IContractOperation,
  TransactionType,
} from '@store/history/history.types'
import { createSafeDeploymentOperation } from '@store/history/history.utils'
import { ETransactionStatus } from '@tvl-labs/khalani-ui'

export function* createSafeDeploymentPlan(): Generator<
  StrictEffect,
  {
    transactionId: string
  }
> {
  const operations: IContractOperation[] = []
  const transactionId = uuid()

  operations.push(createSafeDeploymentOperation())

  yield* put(
    historyActions.addTransaction({
      id: transactionId,
      type: TransactionType.CreateSafe,
      operations,
      status: ETransactionStatus.Pending,
    }),
  )

  return {
    transactionId,
  }
}
