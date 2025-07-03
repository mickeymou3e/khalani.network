import { StrictEffect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'
import { v4 as uuid } from 'uuid'

import { getPoolConfig } from '@dataSource/graph/pools/pools/constants'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { historyActions } from '@store/history/history.slice'
import {
  IContractOperation,
  TransactionStatus,
  TransactionType,
} from '@store/history/history.types'
import {
  createApproveOperation,
  createLockOperation,
} from '@store/history/history.utils'
import { networkSelectors } from '@store/network/network.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { BigDecimal } from '@utils/math'

export function* createLockPlan(
  tokenAddress: string,
  amount: BigDecimal,
  lockdropAddress: string,
): Generator<
  StrictEffect,
  {
    transactionId: string
    shouldApproveToken: boolean
    operationIds: string[]
  }
> {
  const applicationChainId = yield* select(networkSelectors.applicationChainId)
  const operations: IContractOperation[] = []
  const token = getPoolConfig(tokenAddress, applicationChainId)

  const connectTokenContractToAddress = yield* select(
    contractsSelectors.tokenConnector,
  )

  if (!token) throw Error('Token not found')

  const userAddress = yield* select(walletSelectors.godwokenShortAddress)
  if (!userAddress) throw Error('userAddress  not found')

  const tokenContract = connectTokenContractToAddress?.(tokenAddress)

  const allowance = yield* call(
    tokenContract.allowance,
    userAddress,
    lockdropAddress,
  )

  let shouldApproveToken = false

  if (amount.gt(BigDecimal.from(allowance, 18))) {
    shouldApproveToken = true
    operations.push(
      createApproveOperation(token.displayName, amount.toString()),
    )
  }

  operations.push(createLockOperation(token.displayName, amount))

  const transactionId = uuid()

  yield* put(
    historyActions.addTransaction({
      id: transactionId,
      type: TransactionType.Lock,
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
