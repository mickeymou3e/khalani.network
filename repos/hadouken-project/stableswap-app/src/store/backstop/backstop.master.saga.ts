import { all, takeLatest } from 'typed-redux-saga'

import { fetchMoreLiquidations } from '@dataSource/graph/backstop'

import { backstopActions } from './backstop.slice'
import { depositToBackstopRequestSaga } from './saga/deposit/depositToBackstopRequest.saga'
import { initializeBackstopSaga } from './saga/initializeBackstop.saga'
import { backstopWithdrawRequestSaga } from './saga/withdraw/backstopWithdrawRequest.saga'

export function* backstopMasterSaga(): Generator {
  yield all([
    takeLatest(
      backstopActions.initializeBackstopRequest.type,
      initializeBackstopSaga,
    ),

    takeLatest(
      backstopActions.depositToBackstopRequest.type,
      depositToBackstopRequestSaga,
    ),

    takeLatest(
      backstopActions.backstopWithdrawRequest.type,
      backstopWithdrawRequestSaga,
    ),
    takeLatest(
      backstopActions.loadMoreLiquidationsRequest.type,
      fetchMoreLiquidations,
    ),
  ])
}
