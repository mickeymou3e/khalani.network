import { call, put } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { updateLatestBlock } from '@shared/store'
import { notificationActions } from '@store/notification/notification.slice'
import { queryRefineSaga, QueryRefineParams } from '@tvl-labs/sdk'

export function* queryRefineActionHandler(
  action: PayloadAction<QueryRefineParams>,
): Generator {
  try {
    yield* put(notificationActions.setPendingStatus())

    yield* call(queryRefineSaga, action)

    yield* call(updateLatestBlock)

    yield* put(notificationActions.setCompletedStatus())
  } catch (error) {
    console.error(`Query refine request has failed ${error}`)
  }
}
