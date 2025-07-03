import { call, put } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { updateLatestBlock } from '@shared/store'
import { notificationActions } from '@store/notification/notification.slice'
import { createRefineSaga, CreateRefineSagaParams } from '@tvl-labs/sdk'

export function* createRefineActionHandler(
  action: PayloadAction<CreateRefineSagaParams>,
): Generator {
  try {
    yield* put(notificationActions.setPendingStatus())

    const createSwapIntentResult = yield* call(createRefineSaga, action)

    if (!createSwapIntentResult)
      console.error(`Create refine result is undefined`)

    yield* call(updateLatestBlock)

    yield* put(notificationActions.setCompletedStatus())
  } catch (error) {
    console.error(`Create refine request has failed ${error}`)
  }
}
