import { providerSelector } from '@store/provider/provider.selector'
import { call, put, select } from 'typed-redux-saga'
import { logger } from '@utils/logger'
import { withdrawMTokenActions } from './withdrawMToken.slice'
import { PayloadAction } from '@reduxjs/toolkit'
import { WithdrawMTokenParams } from './withdrawMToken.types'
import { withdrawMTokens } from '@services/medusa'
import { signMessageSaga } from '@dataSource/signature/signMessage.saga'

export function* withdrawMTokenSaga(
  action: PayloadAction<WithdrawMTokenParams>,
): Generator {
  try {
    const { from, mToken, amount } = action.payload

    const userAddress = yield* select(providerSelector.userAddress)
    if (!userAddress) {
      throw new Error('Wallet is not connected')
    }

    const signedOwner = yield* call(signMessageSaga, from)
    if (!signedOwner) {
      throw new Error('Signed owner is not valid')
    }

    yield* put(withdrawMTokenActions.signed())

    const signedAddress = { address: from, signature: signedOwner }
    yield* call(withdrawMTokens, signedAddress, mToken, amount)

    yield* put(withdrawMTokenActions.withdrawMTokenSuccess())
  } catch (error) {
    yield* put(withdrawMTokenActions.withdrawMTokenFailure(error as any))
    logger.error(error)
  }
}
