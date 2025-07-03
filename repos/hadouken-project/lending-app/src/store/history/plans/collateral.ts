import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { put, select } from 'typed-redux-saga'
import { v4 as uuid } from 'uuid'

import { IContractOperation, TransactionStatus } from '@interfaces/history'
import { ITokenValue } from '@interfaces/tokens'
import { tokenSelectors } from '@store/tokens/tokens.selector'

import { historyActions } from '../history.slice'
import { TransactionType } from '../history.types'
import { createCollateralOperation } from '../history.utils'

export function* createCollateralPlan(
  asset: string,
  amount: BigNumber,
  useAsCollateral: boolean,
): Generator<StrictEffect, { transactionId: string | null }> {
  const operations: IContractOperation[] = []

  const tokenSelector = yield* select(tokenSelectors.selectById)
  const selectedToken = tokenSelector(asset)

  if (!selectedToken) return { transactionId: null }

  const token: ITokenValue = {
    address: asset,
    symbol: selectedToken.symbol,
    value: amount,
    decimals: selectedToken.decimals,
    displayName: selectedToken.displayName,
  }

  operations.push(createCollateralOperation(token, useAsCollateral))

  const transactionId = uuid()

  yield* put(
    historyActions.addTransaction({
      id: transactionId,
      type: TransactionType.Collateral,
      operations: operations,
      status: TransactionStatus.Pending,
    }),
  )

  return {
    transactionId: transactionId,
  }
}
