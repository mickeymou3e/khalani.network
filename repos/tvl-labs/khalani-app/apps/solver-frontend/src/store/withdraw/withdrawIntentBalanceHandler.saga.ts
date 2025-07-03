import { call, put } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { notificationActions } from '@store/notification/notification.slice'
import {
  WithdrawIntentBalanceParams,
  withdrawIntentBalanceSaga,
} from '@tvl-labs/sdk'

export function* createWithdrawIntentBalanceActionHandler(
  action: PayloadAction<WithdrawIntentBalanceParams>,
): Generator {
  try {
    yield* put(notificationActions.setPendingStatus())

    yield* call(withdrawIntentBalanceSaga, action)

    yield* put(notificationActions.setCompletedStatus())
  } catch (error) {
    console.error(`Withdraw mToken request has failed ${error}`)
  }
}
