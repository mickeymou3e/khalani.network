import { all, takeEvery } from 'typed-redux-saga'

import { fetchLiquidationData } from './action/fetchLiquidations'
import { liquidationsActions } from './liquidation.slice'

export function* liquidationsMasterSaga(): Generator {
  yield all([
    takeEvery(
      liquidationsActions.fetchLiquidationsRequest.type,
      fetchLiquidationData,
    ),
  ])
}
