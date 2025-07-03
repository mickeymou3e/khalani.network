import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'
import { v4 as uuid } from 'uuid'

import { IContractOperation, TransactionStatus } from '@interfaces/history'
import { ITokenValue } from '@interfaces/tokens'
import { contractsSelectors } from '@store/provider/provider.selector'

import { walletSelectors } from '../../wallet/wallet.selector'
import { historyActions } from '../history.slice'
import { TransactionType } from '../history.types'
import { createMintOperation } from '../history.utils'

export function* createMintPlan(
  asset: string,
  amount: BigNumber,
): Generator<StrictEffect, { transactionId: string | null }> {
  const operations: IContractOperation[] = []

  const ercSelector = yield* select(contractsSelectors.ercSelector)
  const ercContract = ercSelector?.(asset)

  if (!ercContract) return { transactionId: null }

  const symbol = yield* call(ercContract.symbol)
  const decimals = yield* call(ercContract.decimals)

  const token: ITokenValue = {
    address: asset,
    symbol: symbol,
    value: amount,
    decimals: decimals,
    displayName: symbol,
  }
  const applicationChainId = yield* select(walletSelectors.applicationChainId)
  operations.push(createMintOperation(token, applicationChainId))

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
    transactionId: transactionId,
  }
}
