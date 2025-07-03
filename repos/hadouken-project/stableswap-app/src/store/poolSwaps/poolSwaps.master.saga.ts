import { all, call, takeLatest } from 'typed-redux-saga'

import { poolSwapsActionHandler } from './poolSwaps.saga'
import { poolSwapsActions } from './poolSwaps.slice'

export function* actionHandler(): Generator {
  yield* all([
    takeLatest(poolSwapsActions.fetchPoolSwapsRequest, poolSwapsActionHandler),
  ])
}

export function* poolSwapsMasterSaga(): Generator {
  yield all([call(actionHandler)])
}
