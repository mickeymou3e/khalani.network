import { all, takeLatest } from 'typed-redux-saga'

import { poolsActions } from './pool.slice'
import { updateSaga } from './saga/update/update.saga'

export function* poolsMasterSaga(): Generator {
  yield all([takeLatest(poolsActions.updateRequest.type, updateSaga)])
}
