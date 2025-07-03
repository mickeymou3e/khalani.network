import { all, fork, spawn, takeLatest } from 'typed-redux-saga'

import { balancesActions } from './balances.slice'
import { watchLatestBlockNumber } from './blockWatcher/blockWatcher.saga'
import { fetchUserBalances } from './fetchUserBalances/fetchUserBalances.saga'
import { updateBalances } from './updateBalances/updateBalances.saga'
import { watchBalances } from './userBalancesWatcher'

export function* balancesMasterSaga(): Generator {
  yield all([
    spawn(watchLatestBlockNumber),
    takeLatest(
      balancesActions.fetchUserBalancesRequest.type,
      fetchUserBalances,
    ),
    takeLatest(balancesActions.updateBalancesRequest.type, updateBalances),
    fork(watchBalances),
  ])
}
