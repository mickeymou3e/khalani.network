import { all, call, takeLatest } from 'typed-redux-saga'

import { fetchPoolJoinsExits } from './poolJoinsExits.saga'
import { poolJoinsExitsActions } from './poolJoinsExits.slice'

export function* actionHandler(): Generator {
  yield* all([
    takeLatest(
      poolJoinsExitsActions.fetchPoolJoinsExitsRequest,
      fetchPoolJoinsExits,
    ),
  ])
}

export function* poolJoinsExitsMasterSaga(): Generator {
  yield all([call(actionHandler)])
}
