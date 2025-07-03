import { all, takeEvery } from 'typed-redux-saga'

import { fetchReserves } from './actions/fetchReserves'
import { reservesActions } from './reserves.slice'

export function* reservesMasterSaga(): Generator {
  yield all([
    takeEvery(reservesActions.fetchReservesRequest.type, fetchReserves),
  ])
}
