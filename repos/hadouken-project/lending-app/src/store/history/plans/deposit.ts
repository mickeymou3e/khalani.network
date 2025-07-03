import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'
import { v4 as uuid } from 'uuid'

import { IContractOperation, TransactionStatus } from '@interfaces/history'
import { contractsSelectors } from '@store/provider/provider.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { historyActions } from '../history.slice'
import { TransactionType } from '../history.types'
import {
  createApproveOperation,
  createDepositOperation,
} from '../history.utils'

export function* createDepositPlan(
  asset: string,
  amount: BigNumber,
  isWrappedToken: boolean,
): Generator<
  StrictEffect,
  { transactionId: string | null; shouldApproveToken?: boolean }
> {
  let shouldApproveToken = false
  const operations: IContractOperation[] = []
  const userAddress = yield* select(walletSelectors.ethAddress)
  const poolContract = yield* select(contractsSelectors.pool)

  const ercSelector = yield* select(contractsSelectors.ercSelector)
  const ercContract = ercSelector?.(asset)

  if (!ercContract || !poolContract || !userAddress)
    return { transactionId: null }

  const symbol = yield* call(ercContract.symbol)
  const decimals = yield* call(ercContract.decimals)

  const allowanceAmount = yield* call(
    ercContract.allowance,
    userAddress,
    poolContract.address,
  )

  const token = {
    address: ercContract.address,
    symbol: symbol,
    value: amount,
    decimals: decimals,
    displayName: symbol,
  }

  if (!isWrappedToken && allowanceAmount.lt(amount)) {
    shouldApproveToken = true
    operations.push(createApproveOperation(token))
  }

  operations.push(createDepositOperation(token))

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
    transactionId: transactionId,
    shouldApproveToken: shouldApproveToken,
  }
}
