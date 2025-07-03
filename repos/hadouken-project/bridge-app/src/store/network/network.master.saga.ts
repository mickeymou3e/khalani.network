import { all, call, takeLatest, spawn } from 'typed-redux-saga'

import { updateNativeTokenBalance } from '@store/wallet/saga/updateNativeTokenBalance.saga'

import { networkActions } from './network.slice'
import { expectedNetworkChangeSaga } from './saga/watchExpectedNetwork'
import { watchLatestGodwokenBlockNumber } from './saga/watchLatestBlock.saga'

export function* watchers(): Generator {
  yield* all([spawn(watchLatestGodwokenBlockNumber)])
}

function* actionHandlers(): Generator {
  yield* all([
    takeLatest(
      networkActions.updateExpectedNetwork.type,
      expectedNetworkChangeSaga,
    ),
    takeLatest(networkActions.updateLatestBlock.type, updateNativeTokenBalance),
  ])
}

export function* networkMasterSaga(): Generator {
  yield all([call(actionHandlers), call(watchers)])
}
