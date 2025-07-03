import { StrictEffect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'
import { v4 as uuid } from 'uuid'

import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { historyActions } from '@store/history/history.slice'
import {
  IContractOperation,
  TransactionStatus,
  TransactionType,
} from '@store/history/history.types'
import {
  createApproveOperation,
  createDepositToPoolOperation,
} from '@store/history/history.utils'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { BigDecimal } from '@utils/math'

export function* createBackstopDepositPlan(
  tokenAddress: string,
  amount: BigDecimal,
): Generator<
  StrictEffect,
  {
    transactionId: string
    shouldApproveToken: boolean
    operationIds: string[]
  }
> {
  const operations: IContractOperation[] = []
  const selectToken = yield* select(tokenSelectors.selectById)

  const token = selectToken(tokenAddress)
  const connectTokenContractToAddress = yield* select(
    contractsSelectors.tokenConnector,
  )

  if (!token) throw Error('Token not found')

  const backstopContracts = yield* select(contractsSelectors.backstopContracts)
  const backstopContract = backstopContracts?.backstop
  if (!backstopContract) throw Error('Backstop not found')

  const userAddress = yield* select(walletSelectors.godwokenShortAddress)
  if (!userAddress) throw Error('userAddress  not found')

  const tokenContract = connectTokenContractToAddress?.(tokenAddress)

  const allowance = yield* call(
    tokenContract.allowance,
    userAddress,
    backstopContract.address,
  )

  let shouldApproveToken = false

  if (amount.gt(BigDecimal.from(allowance, token.decimals))) {
    shouldApproveToken = true
    operations.push(
      createApproveOperation(token.displayName, amount.toString()),
    )
  }

  operations.push(
    createDepositToPoolOperation([token], [amount], 'Backstop pool', false),
  )

  const transactionId = uuid()

  yield* put(
    historyActions.addTransaction({
      id: transactionId,
      type: TransactionType.Deposit,
      operations: operations,
      status: TransactionStatus.Pending,
    }),
  )

  return {
    transactionId,
    shouldApproveToken,
    operationIds: operations.map((operation) => operation.id),
  }
}
