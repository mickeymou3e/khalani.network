import { all, call } from 'typed-redux-saga'

import { spawnPoolsBalancesWatcher } from './saga/poolTokensBalances/watcher'

export function* watchers(): Generator {
  yield* all([call(spawnPoolsBalancesWatcher)])
}

export function* balancesMasterSaga(): Generator {
  yield all([call(watchers)])
}
