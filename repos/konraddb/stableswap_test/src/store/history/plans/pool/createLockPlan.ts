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
  createLockOperation,
} from '@store/history/history.utils'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { BigDecimal } from '@utils/math'

export function* createLockPlan(
  tokenAddress: IToken['address'],
  tokenAmount: BigDecimal | undefined,
): Generator<
  StrictEffect,
  { transactionId: string; shouldAskForBaseTokenApprove: boolean }
> {
  const operations: IContractOperation[] = []

  const vaultContract = yield* select(contractsSelectors.vault)
  if (!vaultContract) throw Error('Vault contract not found')

  const selectTokenById = yield* select(tokenSelectors.selectById)
  const tokenConnector = yield* select(contractsSelectors.tokenConnector)

  const userAddress = yield* select(walletSelectors.godwokenShortAddress)
  if (!userAddress) throw Error('User address not found')

  const tokenContract = tokenConnector?.(tokenAddress)
  if (!tokenContract) throw Error('Token contract not found')

  const inToken = selectTokenById(tokenAddress)
  if (!inToken) throw Error('Token in not found')

  const allowanceValue = yield* call(
    tokenContract.allowance,
    userAddress,
    vaultContract.address,
    NetworkOverrides.TxParams,
  )

  if (!tokenAmount) throw Error('Token amount not found')
  const shouldAskForBaseTokenApprove = BigDecimal.from(
    allowanceValue,
    inToken?.decimals,
  ).lt(tokenAmount)

  if (shouldAskForBaseTokenApprove) {
    operations.push(
      createApproveOperation(
        inToken?.symbol,
        tokenAmount.toString(),
        'Hadouken Vault',
      ),
    )
  }

  operations.push(createLockOperation(inToken.symbol, tokenAmount.toString()))

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
    transactionId,
    shouldAskForBaseTokenApprove: shouldAskForBaseTokenApprove,
  }
}
