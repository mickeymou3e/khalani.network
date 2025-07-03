import { all, takeLatest } from 'typed-redux-saga'

import { lendingActions } from './lending.slice'
import { fetchLendingReservesSaga } from './saga/fetchLendingReserves.saga'

export function* lendingMasterSaga(): Generator {
  yield all([
    takeLatest(
      lendingActions.fetchLendingTokensRequest.type,
      fetchLendingReservesSaga,
    ),
  ])
}
