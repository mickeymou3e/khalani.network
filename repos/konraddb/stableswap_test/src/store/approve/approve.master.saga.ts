import { takeLatest } from 'redux-saga/effects'
import { all, call } from 'typed-redux-saga'

import { approveActions } from './approve.slice'
import { approveRequestSaga } from './saga/approveRequest.saga'

export function* actionHandlers(): Generator {
  yield* all([
    takeLatest(approveActions.approveRequest.type, approveRequestSaga),
  ])
}

export function* approveMasterSaga(): Generator {
  yield all([call(actionHandlers)])
}
