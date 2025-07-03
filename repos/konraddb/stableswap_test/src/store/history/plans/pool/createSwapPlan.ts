import { StrictEffect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'
import { v4 as uuid } from 'uuid'

import { NetworkOverrides } from '@constants/Networks'
import { IToken } from '@interfaces/token'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { historyActions } from '@store/history/history.slice'
import {
  IContractOperation,
  TransactionStatus,
  TransactionType,
} from '@store/history/history.types'
import {
  createApproveOperation,
  createBlockConfirmation,
  createSwapOperation,
} from '@store/history/history.utils'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { BigDecimal } from '@utils/math'

export function* createSwapPlan(
  inTokenAddress: IToken['address'],
  inTokenAmount: BigDecimal,
  outTokenAddress: IToken['address'],
): Generator<
  StrictEffect,
  { transactionId: string; shouldAskForBaseTokenApprove: boolean }
> {
  const operations: IContractOperation[] = []

  const vaultContract = yield* select(contractsSelectors.vault)
  if (!vaultContract) throw Error('vaultContract not defined')

  const selectTokenById = yield* select(tokenSelectors.selectById)
  const tokenConnector = yield* select(contractsSelectors.tokenConnector)
  const userAddress = yield* select(walletSelectors.godwokenShortAddress)
  if (!userAddress) throw Error('User address not found')

  const tokenContract = tokenConnector?.(inTokenAddress)
  if (!tokenContract) throw Error('Token contract not found')

  const inToken = selectTokenById(inTokenAddress)

  if (!inToken) throw Error('In token not found')

  const outToken = selectTokenById(outTokenAddress)

  if (!outToken) throw Error('Out token not found')

  const allowanceValue = yield* call(
    tokenContract.allowance,
    userAddress,
    vaultContract.address,
    NetworkOverrides.TxParams,
  )

  const shouldAskForBaseTokenApprove = BigDecimal.from(
    allowanceValue,
    inToken.decimals,
  ).lt(inTokenAmount)

  if (shouldAskForBaseTokenApprove) {
    operations.push(
      createApproveOperation(
        inToken.symbol,
        inTokenAmount.toString(),
        'Hadouken Vault',
      ),
    )
  }

  operations.push(
    createSwapOperation(
      inToken.symbol,
      outToken.symbol,
      inTokenAmount.toString(),
    ),
  )

  operations.push(createBlockConfirmation())

  const transactionId = uuid()

  yield* put(
    historyActions.addTransaction({
      id: transactionId,
      type: TransactionType.Swap,
      operations: operations,
      status: TransactionStatus.Pending,
    }),
  )

  return {
    transactionId: transactionId,
    shouldAskForBaseTokenApprove: shouldAskForBaseTokenApprove,
  }
}
