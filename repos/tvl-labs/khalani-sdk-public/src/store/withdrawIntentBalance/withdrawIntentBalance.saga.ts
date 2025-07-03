import { providerSelector } from '@store/provider/provider.selector'
import { call, put, select } from 'typed-redux-saga'
import { logger } from '@utils/logger'
import { withdrawIntentBalanceActions } from './withdrawIntentBalance.slice'
import { PayloadAction } from '@reduxjs/toolkit'
import { WithdrawIntentBalanceParams } from './withdrawIntentBalance.types'
import { cancelIntent } from '@services/medusa/cancel.service'
import { signMessageSaga } from '@dataSource/signature/signMessage.saga'

export function* withdrawIntentBalanceSaga(
  action: PayloadAction<WithdrawIntentBalanceParams>,
): Generator {
  try {
    const { intentId } = action.payload

    const userAddress = yield* select(providerSelector.userAddress)
    if (!userAddress) {
      throw new Error('Wallet is not connected')
    }

    const signature = yield* call(signMessageSaga, intentId)
    if (!signature) {
      throw new Error('Signature is not valid')
    }
    yield* put(withdrawIntentBalanceActions.signed())

    const cancelIntentPayload = { intent_id: intentId, signature }
    yield* call(cancelIntent, cancelIntentPayload)

    yield* put(withdrawIntentBalanceActions.withdrawIntentBalanceSuccess())
  } catch (error) {
    yield* put(
      withdrawIntentBalanceActions.withdrawIntentBalanceFailure(error as any),
    )
    logger.error(error)
  }
}
