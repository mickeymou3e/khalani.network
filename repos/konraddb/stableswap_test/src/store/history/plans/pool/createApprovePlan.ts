import { StrictEffect } from 'redux-saga/effects'
import { put } from 'typed-redux-saga'
import { v4 as uuid } from 'uuid'

import { IApprovalToken } from '@components/buttons/ApproveButton/ApproveButton.types'
import { historyActions } from '@store/history/history.slice'
import {
  IContractOperation,
  TransactionStatus,
  TransactionType,
} from '@store/history/history.types'
import { createApproveOperation } from '@store/history/history.utils'

export function* createApprovePlan(
  tokens: IApprovalToken[],
): Generator<
  StrictEffect,
  {
    transactionId: string
  }
> {
  const operations: IContractOperation[] = []
  const transactionId = uuid()

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]
    operations.push(
      createApproveOperation(
        token.symbol,
        token.amount.toString(),
        token.address,
      ),
    )
  }

  yield* put(
    historyActions.addTransaction({
      id: transactionId,
      type: TransactionType.Approve,
      operations: operations,
      status: TransactionStatus.Pending,
    }),
  )

  return {
    transactionId: transactionId,
  }
}
