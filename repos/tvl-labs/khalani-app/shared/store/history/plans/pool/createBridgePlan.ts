import { StrictEffect } from 'redux-saga/effects'
import { put, select } from 'typed-redux-saga'
import { v4 as uuid } from 'uuid'

import { historyActions } from '@store/history/history.slice'
import {
  IContractOperation,
  TransactionType,
} from '@store/history/history.types'
import {
  createBlockConfirmation,
  createBridgeOperation,
} from '@store/history/history.utils'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { ETransactionStatus } from '@tvl-labs/khalani-ui'
import { Network, tokenSelectors, TokenModel, BigDecimal } from '@tvl-labs/sdk'

export function* createBridgePlan(
  tokenAddress: TokenModel['address'],
  tokenAmount: BigDecimal | undefined,
  sourceChainHexId: Network,
): Generator<StrictEffect, { transactionId: string }> {
  const operations: IContractOperation[] = []

  const getRespectiveKhalaTokensWithChainId = yield* select(
    tokenSelectors.getFullTokensDetails,
  )

  const inTokens = getRespectiveKhalaTokensWithChainId([
    {
      address: tokenAddress,
      chainId: sourceChainHexId,
    },
  ])
  const inToken = inTokens[0]
  if (!inToken) throw Error('Token in not found')

  const userAddress = yield* select(walletSelectors.userAddress)
  if (!userAddress) throw Error('User address not found')

  if (!tokenAmount) throw Error('Token amount not found')

  operations.push(createBridgeOperation(inToken.symbol, tokenAmount.toString()))

  operations.push(createBlockConfirmation())

  const transactionId = uuid()

  yield* put(
    historyActions.addTransaction({
      id: transactionId,
      type: TransactionType.BridgeDeposit,
      operations: operations,
      status: ETransactionStatus.Pending,
    }),
  )

  return {
    transactionId,
  }
}
