import { all, takeEvery } from 'typed-redux-saga'

import { backstopActions } from './backstop.slice'
import { fetchBackstopPools } from './fetchBackstopPools/fetchBackstopPools.saga'

export function* backstopMasterSaga(): Generator {
  yield all([
    takeEvery(
      backstopActions.fetchBackstopPoolsRequest.type,
      fetchBackstopPools,
    ),
  ])
}
