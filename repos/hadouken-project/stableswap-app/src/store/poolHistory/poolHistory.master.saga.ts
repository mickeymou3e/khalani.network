import { all, takeLatest } from 'typed-redux-saga'

import { poolsHistoryActions } from './poolHistory.slice'
import { updateSaga } from './saga/update/update.saga'

export function* poolsHistoryMasterSaga(): Generator {
  yield all([takeLatest(poolsHistoryActions.update.type, updateSaga)])
}
