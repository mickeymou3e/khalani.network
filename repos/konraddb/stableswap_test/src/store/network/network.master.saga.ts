/* Godwoken V1 TEMP Stub */
import { all, call, fork, takeLatest } from 'typed-redux-saga'

import { watchLatestBlockNumber } from '@dataSource/blockchain/block'
import { updateAllowanceSaga } from '@store/allowance/saga/updateAllowance.saga'
import { updateUserBalances } from '@store/balances/saga/updateBalances/updateUserBalances.saga'
import { updateKhalaBalancesSaga } from '@store/khala/balances/saga/updateKhalaBalances.saga'
import { updateNativeTokenBalance } from '@store/wallet/saga/updateNativeTokenBalance.saga'

import { networkActions } from './network.slice'
import { changeNetwork } from './saga/changeNetwork.saga'

export function* watchers(): Generator {
  yield* all([fork(watchLatestBlockNumber)])
}

function* actionHandlers(): Generator {
  yield* all([
    takeLatest(networkActions.updateExpectedNetwork.type, changeNetwork),
    takeLatest(networkActions.updateLatestBlock.type, updateUserBalances),
    takeLatest(networkActions.updateLatestBlock.type, updateNativeTokenBalance),
    takeLatest(networkActions.updateLatestBlock.type, updateAllowanceSaga),
    takeLatest(networkActions.updateLatestBlock.type, updateKhalaBalancesSaga),
  ])
}

export function* networkMasterSaga(): Generator {
  yield all([call(actionHandlers), call(watchers)])
}
