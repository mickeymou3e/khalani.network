import { all, call, takeLatest } from 'typed-redux-saga'

import { initializeChainsSaga } from './chains.initialize.saga'
import { chainsActions } from './chains.slice'

function* actionHandlers(): Generator {
  yield* all([
    takeLatest(
      chainsActions.initializeChainsRequest.type,
      initializeChainsSaga,
    ),
  ])
}

export function* networkMasterSaga(): Generator {
  yield all([call(actionHandlers)])
}
