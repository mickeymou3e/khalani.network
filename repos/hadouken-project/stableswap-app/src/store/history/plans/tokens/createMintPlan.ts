import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { put, select } from 'typed-redux-saga'
import { v4 as uuid } from 'uuid'

import { historyActions } from '@store/history/history.slice'
import {
  IContractOperation,
  TransactionStatus,
  TransactionType,
} from '@store/history/history.types'
import { createMintOperation } from '@store/history/history.utils'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { BigDecimal } from '@utils/math'

export function* createMintPlan(
  tokenAddress: string,
  amount: BigNumber,
): Generator<
  StrictEffect,
  {
    transactionId: string
    operationIds: string[]
  }
> {
  const selectToken = yield* select(tokenSelectors.selectById)
  const token = selectToken(tokenAddress)

  const operations: IContractOperation[] = []

  const tokenName = token?.displayName ?? token?.name

  operations.push(
    createMintOperation(
      tokenName ?? '',
      BigDecimal.from(amount, token?.decimals),
    ),
  )

  const transactionId = uuid()

  yield* put(
    historyActions.addTransaction({
      id: transactionId,
      type: TransactionType.Mint,
      operations: operations,
      status: TransactionStatus.Pending,
    }),
  )

  return {
    transactionId,
    operationIds: operations.map((operation) => operation.id),
  }
}
