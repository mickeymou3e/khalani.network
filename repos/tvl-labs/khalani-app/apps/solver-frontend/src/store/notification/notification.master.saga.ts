import { takeLatest } from 'redux-saga/effects'
import { all, call } from 'typed-redux-saga'

import { createNotificationFlow } from './notification.saga'
import { notificationActions } from './notification.slice'

export function* actionHandlers(): Generator {
  yield* all([
    takeLatest(
      notificationActions.initializeNotification.type,
      createNotificationFlow,
    ),
  ])
}

export function* notificationMasterSaga(): Generator {
  yield all([call(actionHandlers)])
}
