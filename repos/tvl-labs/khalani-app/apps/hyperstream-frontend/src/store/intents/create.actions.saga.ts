import { call, put } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { updateLatestBlock } from '@shared/store'
import { notificationActions } from '@store/notification/notification.slice'
import { swapIntentSaga, Intent } from '@tvl-labs/sdk'

export function* createIntentActionHandler(
  action: PayloadAction<Intent>,
): Generator {
  try {
    yield* put(notificationActions.setPendingStatus())

    const createSwapIntentResult = yield* call(swapIntentSaga, action)

    if (!createSwapIntentResult)
      throw new Error(`Create swap intent result is undefined`)

    // yield* call(
    //   storeIntentSaga,
    //   createSwapIntentResult.intent,
    //   createSwapIntentResult.signature,
    // )
    yield* call(updateLatestBlock)

    yield* put(notificationActions.setCompletedStatus())
  } catch (error) {
    console.error(`Create intent request has failed ${error}`)
  }
}
