import { all, call } from 'typed-redux-saga'

import { watchUserShares } from './watchUserShares/watcher.saga'

export function* watchers(): Generator {
  yield* all([call(watchUserShares)])
}

function* actionHandlers(): Generator {
  yield all([])
}

export function* userSharesMasterSaga(): Generator {
  yield all([call(actionHandlers), call(watchers)])
}
