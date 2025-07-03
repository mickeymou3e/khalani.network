/* Godwoken V1 TEMP Stub */
import { all, call, fork, takeLatest } from 'typed-redux-saga'

import { watchLatestBlockNumber } from '@dataSource/blockchain/block'
import { updateUserBalances } from '@store/balances/saga/updateBalances/updateUserBalances.saga'
import { updateNativeTokenBalance } from '@store/wallet/saga/updateNativeTokenBalance.saga'

import { networkActions } from './network.slice'

export function* watchers(): Generator {
  yield* all([fork(watchLatestBlockNumber)])
}

function* actionHandlers(): Generator {
  yield* all([
    takeLatest(networkActions.updateLatestBlock.type, updateUserBalances),
    takeLatest(networkActions.updateLatestBlock.type, updateNativeTokenBalance),
  ])
}

export function* networkMasterSaga(): Generator {
  yield all([call(actionHandlers), call(watchers)])
}
