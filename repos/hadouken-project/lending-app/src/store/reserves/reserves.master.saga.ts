import { all, takeEvery } from 'typed-redux-saga'

import { initializeReservesSagaRpcCall } from './reserves.initialize.saga'
import { reservesActions } from './reserves.slice'

export function* reservesMasterSaga(): Generator {
  yield all([
    takeEvery(
      reservesActions.fetchReservesRequest.type,
      initializeReservesSagaRpcCall,
    ),
  ])
}
