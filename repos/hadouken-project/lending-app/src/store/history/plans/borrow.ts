import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'
import { v4 as uuid } from 'uuid'

import { BorrowType } from '@constants/Lending'
import { IContractOperation, TransactionStatus } from '@interfaces/history'
import { ITokenValue } from '@interfaces/tokens'
import { contractsSelectors } from '@store/provider/provider.selector'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { historyActions } from '../history.slice'
import { TransactionType } from '../history.types'
import { createApproveOperation, createBorrowOperation } from '../history.utils'

export function* createBorrowPlan(
  asset: string,
  amount: BigNumber,
  borrowType: BorrowType,
  isWrappedToken: boolean,
): Generator<
  StrictEffect,
  { transactionId: string | null; shouldApproveToken: boolean }
> {
  const operations: IContractOperation[] = []
  const userAddress = yield* select(walletSelectors.ethAddress)
  const wEthGateway = yield* select(contractsSelectors.wEthGateway)
  const stableDebtToken = yield* select(contractsSelectors.stableDebtToken)
  const variableDebtToken = yield* select(contractsSelectors.variableDebtToken)
  const reserveSelector = yield* select(reservesSelectors.selectById)
  const ercSelector = yield* select(contractsSelectors.ercSelector)
  const ercContract = ercSelector?.(asset)

  if (!ercContract) return { transactionId: null, shouldApproveToken: false }

  const symbol = yield* call(ercContract.symbol)
  const decimals = yield* call(ercContract.decimals)

  const token: ITokenValue = {
    address: asset,
    symbol: symbol,
    value: amount,
    decimals: decimals,
    displayName: symbol,
  }

  let shouldApproveToken = false

  if (isWrappedToken) {
    if (!wEthGateway) throw Error('wEthGateway not defined')
    if (!userAddress) throw Error('userAddress not defined')

    const reserve = reserveSelector(asset)
    if (!reserve) throw Error('reserve not defined')

    let allowance
    if (borrowType === BorrowType.stable) {
      if (!stableDebtToken) throw Error('stableDebtToken not defined')

      const stableToken = stableDebtToken(reserve.stableDebtTokenAddress)
      allowance = yield* call(
        stableToken.borrowAllowance,
        userAddress,
        wEthGateway.address,
      )
    } else {
      if (!variableDebtToken) throw Error('variableDebtToken not defined')

      const variableToken = variableDebtToken(reserve.variableDebtTokenAddress)
      allowance = yield* call(
        variableToken.borrowAllowance,
        userAddress,
        wEthGateway.address,
      )
    }

    if (allowance.lt(amount)) {
      operations.push(createApproveOperation(token))
      shouldApproveToken = true
    }
  }

  operations.push(createBorrowOperation(token, borrowType))

  const transactionId = uuid()

  yield* put(
    historyActions.addTransaction({
      id: transactionId,
      type: TransactionType.Borrow,
      operations: operations,
      status: TransactionStatus.Pending,
    }),
  )

  return {
    transactionId: transactionId,
    shouldApproveToken,
  }
}
