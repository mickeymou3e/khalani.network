import { all, takeEvery } from 'redux-saga/effects'
import { takeLatest } from 'typed-redux-saga'

import { toggleBadge } from './history.badge.saga'
import { initializeHistorySaga } from './history.initialize.saga'
import { historyActions } from './history.slice'

export function* historyMasterSaga(): Generator {
  yield all([
    takeEvery(historyActions.initializeSaga.type, initializeHistorySaga),
    takeLatest(
      [
        historyActions.setOperationSuccess,
        historyActions.addTransaction,
        historyActions.setOperationFailure,
      ],
      toggleBadge,
    ),
  ])
}
