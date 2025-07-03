import { StrictEffect } from 'redux-saga/effects'
import { put } from 'typed-redux-saga'
import { v4 as uuid } from 'uuid'

import { ETransactionStatus, formatOutputAmount } from '@tvl-labs/khalani-ui'
import { IApprovalToken } from '@tvl-labs/sdk/dist/app/src/store/approve/approve.types'

import { createApproveOperation } from '../../../history'
import { historyActions } from '../../history.slice'
import { IContractOperation, TransactionType } from '../../history.types'

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
        formatOutputAmount(token.amount, token.decimals),
        token.spender,
      ),
    )
  }

  yield* put(
    historyActions.addTransaction({
      id: transactionId,
      type: TransactionType.Approve,
      operations: operations,
      status: ETransactionStatus.Pending,
    }),
  )

  return {
    transactionId,
  }
}
