import { call, put, select } from 'typed-redux-saga'

import { ActionInProgress } from '@interfaces/action'
import { PayloadAction } from '@reduxjs/toolkit'
import { contractsActions } from '@store/contracts/contracts.slice'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createMintPlan } from '@store/history/plans/tokens/createMintPlan'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { tokensActions } from '../tokens.slice'
import { MintTokenPayload } from '../tokens.types'
import { mintTokenAction } from './mint.action'

export function* mintTokenSaga(
  action: PayloadAction<MintTokenPayload>,
): Generator {
  try {
    yield* put(contractsActions.setActionInProgress(ActionInProgress.Mint))

    const { address, amount } = action.payload
    const userAddress = yield* select(walletSelectors.userAddress)

    if (!userAddress) throw Error('User not connected')

    const { transactionId, operationIds } = yield* call(
      createMintPlan,
      address,
      amount,
    )

    const transactionResult = yield* operationWrapper(
      transactionId,
      operationIds[0],
      call(mintTokenAction, address, amount, userAddress),
    )

    yield* put(tokensActions.mintTokenSuccess())

    return transactionResult
  } catch (e) {
    console.error(e)
    yield* put(tokensActions.mintTokenFailure())
  } finally {
    yield* put(contractsActions.finishActionInProgress())
  }
}
