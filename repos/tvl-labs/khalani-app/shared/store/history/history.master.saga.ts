import { all, takeEvery } from 'redux-saga/effects'

import { initializeHistorySaga } from './history.initialize.saga'
import { historyActions } from './history.slice'

export function* historyMasterSaga(): Generator {
  yield all([
    takeEvery(historyActions.initializeSaga.type, initializeHistorySaga),
  ])
}
