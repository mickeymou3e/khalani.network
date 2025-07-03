import { takeLatest } from 'redux-saga/effects'
import { all, call } from 'typed-redux-saga'

import { approveActions } from '@tvl-labs/sdk'

import { approveRequestActionHandler } from './approveActionHandler.saga'

export function* actionHandlers(): Generator {
  yield* all([
    takeLatest(approveActions.approveRequest.type, approveRequestActionHandler),
  ])
}

export function* approveMasterSaga(): Generator {
  yield all([call(actionHandlers)])
}
