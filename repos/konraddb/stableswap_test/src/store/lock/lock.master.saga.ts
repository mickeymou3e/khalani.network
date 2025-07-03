import { takeLatest } from 'redux-saga/effects'
import { all, call } from 'typed-redux-saga'

import { lockRequestActionHandler } from '@store/lock/saga/lockRequest.saga'

import { lockActions } from './lock.slice'

export function* actionHandlers(): Generator {
  yield* all([
    takeLatest(lockActions.lockRequest.type, lockRequestActionHandler),
  ])
}

export function* lockMasterSaga(): Generator {
  yield all([call(actionHandlers)])
}
