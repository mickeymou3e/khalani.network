import { StrictEffect } from 'redux-saga/effects'
import { put, select } from 'typed-redux-saga'
import { v4 as uuid } from 'uuid'

import { backstopSelectors } from '@store/backstop/backstop.selector'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { historyActions } from '@store/history/history.slice'
import {
  IContractOperation,
  TransactionStatus,
  TransactionType,
} from '@store/history/history.types'
import { createWithdrawFromPoolOperation } from '@store/history/history.utils'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { BigDecimal } from '@utils/math'

export function* createBackstopWithdrawPlan(
  amount: BigDecimal,
): Generator<
  StrictEffect,
  {
    transactionId: string
    operationId: string
  }
> {
  const operations: IContractOperation[] = []
  const backstopToken = yield* select(backstopSelectors.backstopToken)
  const liquidationToken = yield* select(backstopSelectors.liquidationToken)
  const liquidationTokenAddress = liquidationToken?.address

  if (!backstopToken) {
    throw Error('backstopToken not defined')
  }

  if (!liquidationTokenAddress)
    throw Error('liquidationTokenAddress not defined')

  const backstopContracts = yield* select(contractsSelectors.backstopContracts)
  const backstopContract = backstopContracts?.backstop
  if (!backstopContract) throw Error('Backstop not found')

  const userAddress = yield* select(walletSelectors.godwokenShortAddress)
  if (!userAddress) throw Error('userAddress  not found')

  operations.push(
    createWithdrawFromPoolOperation(
      liquidationToken,
      amount,
      [backstopToken],
      [amount],
    ),
  )

  const transactionId = uuid()

  yield* put(
    historyActions.addTransaction({
      id: transactionId,
      type: TransactionType.Withdraw,
      operations: operations,
      status: TransactionStatus.Pending,
    }),
  )

  return {
    transactionId,
    operationId: operations[0].id,
  }
}
