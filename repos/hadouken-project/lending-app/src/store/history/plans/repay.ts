import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'
import { v4 as uuid } from 'uuid'

import { IContractOperation, TransactionStatus } from '@interfaces/history'
import { contractsSelectors } from '@store/provider/provider.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { historyActions } from '../history.slice'
import { TransactionType } from '../history.types'
import { createApproveOperation, createRepayOperation } from '../history.utils'

export function* createRepayPlan(
  asset: string,
  amount: BigNumber,
  approveAmount: BigNumber,
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

  if (!ercContract || !poolContract || !userAddress) {
    return { transactionId: null, shouldApproveToken: false }
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

  if (!isWrappedToken) {
    const approveToken = {
      address: asset,
      symbol: symbol,
      value: approveAmount,
      decimals: decimals,
      displayName: symbol,
    }

    const allowanceAmount = yield* call(
      ercContract.allowance,
      userAddress,
      poolContract.address,
    )

    if (allowanceAmount.lt(approveAmount)) {
      shouldApproveToken = true
      operations.push(createApproveOperation(approveToken))
    }
  }

  operations.push(createRepayOperation(token))

  const transactionId = uuid()

  yield* put(
    historyActions.addTransaction({
      id: transactionId,
      type: TransactionType.Repay,
      operations: operations,
      status: TransactionStatus.Pending,
    }),
  )

  return {
    transactionId: transactionId,
    shouldApproveToken: shouldApproveToken,
  }
}
