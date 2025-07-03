import { call, put } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { updateLatestBlock } from '@shared/store'
import { notificationActions } from '@store/notification/notification.slice'
import { provideLiquiditySaga, UIIntentParams } from '@tvl-labs/sdk'

export function* createIntentActionHandler(
  action: PayloadAction<UIIntentParams>,
): Generator {
  try {
    yield* put(notificationActions.setPendingStatus())

    const createSwapIntentResult = yield* call(provideLiquiditySaga, action)

    if (!createSwapIntentResult)
      console.error(`Create swap intent result is undefined`)

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
