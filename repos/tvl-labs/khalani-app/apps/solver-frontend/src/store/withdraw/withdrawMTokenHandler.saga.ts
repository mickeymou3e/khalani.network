import { call, put } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { notificationActions } from '@store/notification/notification.slice'
import { WithdrawMTokenParams, withdrawMTokenSaga } from '@tvl-labs/sdk'

export function* createWithdrawMTokenActionHandler(
  action: PayloadAction<WithdrawMTokenParams>,
): Generator {
  try {
    yield* put(notificationActions.setPendingStatus())

    yield* call(withdrawMTokenSaga, action)

    yield* put(notificationActions.setCompletedStatus())
  } catch (error) {
    console.error(`Withdraw mToken request has failed ${error}`)
  }
}
