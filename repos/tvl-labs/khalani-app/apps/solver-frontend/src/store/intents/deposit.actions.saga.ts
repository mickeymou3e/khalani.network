import { call, put } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { updateLatestBlock } from '@shared/store'
import { notificationActions } from '@store/notification/notification.slice'
import { DepositParams, depositTokensSaga } from '@tvl-labs/sdk'

export function* depositTokensActionHandler(
  action: PayloadAction<DepositParams>,
): Generator {
  try {
    yield* put(notificationActions.setPendingStatus())

    yield* call(depositTokensSaga, action)
    yield* call(updateLatestBlock)

    yield* put(notificationActions.setCompletedStatus())
  } catch (error) {
    console.error(`Create intent request has failed ${error}`)
  }
}
