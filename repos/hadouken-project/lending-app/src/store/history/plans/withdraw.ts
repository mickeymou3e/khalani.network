import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'
import { v4 as uuid } from 'uuid'

import { IContractOperation, TransactionStatus } from '@interfaces/history'
import { contractsSelectors } from '@store/provider/provider.selector'

import { historyActions } from '../history.slice'
import { TransactionType } from '../history.types'
import {
  createApproveOperation,
  createWithdrawOperation,
} from '../history.utils'

export function* createWithdrawPlan(
  asset: string,
  amount: BigNumber,
  user: string,
  withdrawAll: boolean,
  isWrappedToken: boolean,
  aTokenAddress: string,
): Generator<
  StrictEffect,
  {
    transactionId: string | null
    shouldApproveToken: boolean
    allowance: BigNumber | null
  }
> {
  const operations: IContractOperation[] = []
  const ercSelector = yield* select(contractsSelectors.ercSelector)
  const wEthGateway = yield* select(contractsSelectors.wEthGateway)
  const ercContract = ercSelector?.(asset)

  if (!ercContract)
    return {
      transactionId: null,
      shouldApproveToken: false,
      allowance: null,
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

  let shouldApproveToken = false
  let allowanceRequire = null

  if (isWrappedToken) {
    if (!wEthGateway) throw Error('wEthGateway not defined')

    const aTokenContract = ercSelector?.(aTokenAddress)

    if (!aTokenContract) throw Error('aToken not found!')

    allowanceRequire = withdrawAll
      ? yield* call(aTokenContract.balanceOf, user)
      : amount

    const allowance = yield* call(
      aTokenContract.allowance,
      user,
      wEthGateway.address,
    )

    if (allowance.lt(allowanceRequire)) {
      operations.push(createApproveOperation(token))
      shouldApproveToken = true
    }
  }

  operations.push(createWithdrawOperation(token))

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
    transactionId: transactionId,
    shouldApproveToken,
    allowance: allowanceRequire,
  }
}
