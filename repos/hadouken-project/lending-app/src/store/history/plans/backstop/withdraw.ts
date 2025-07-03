import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'
import { v4 as uuid } from 'uuid'

import { IContractOperation, TransactionStatus } from '@interfaces/history'
import { contractsSelectors } from '@store/provider/provider.selector'

import { historyActions } from '../../history.slice'
import { TransactionType } from '../../history.types'
import { createBackstopWithdrawOperation } from '../../history.utils'

export function* createBackstopWithdrawPlan(
  asset: string,
  amount: BigNumber,
): Generator<StrictEffect, { transactionId: string | null }> {
  const operations: IContractOperation[] = []
  const ercSelector = yield* select(contractsSelectors.ercSelector)
  const ercContract = ercSelector?.(asset)

  if (!ercContract)
    return {
      transactionId: null,
    }

  const symbol = yield* call(ercContract.symbol)
  const decimals = yield* call(ercContract.decimals)

  const token = {
    address: asset,
    symbol: symbol,
    value: amount,
    decimals: decimals,
    displayName: symbol,
  }

  operations.push(createBackstopWithdrawOperation(token))

  const transactionId = uuid()

  yield* put(
    historyActions.addTransaction({
      id: transactionId,
      type: TransactionType.BackstopWithdraw,
      operations: operations,
      status: TransactionStatus.Pending,
    }),
  )

  return {
    transactionId: transactionId,
  }
}
