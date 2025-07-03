import { History } from 'history'
import { all, fork } from 'typed-redux-saga'

import { approveMasterSaga } from './approve/approve.master.saga'
import { historyMasterSaga } from './history/history.master.saga'
import { routerSaga } from './router/router.master.saga'
import { walletMasterSaga } from './wallet/wallet.master.saga'

export function* rootSaga(historyProvider: History): Generator {
  yield all([
    fork(routerSaga, historyProvider),
    fork(walletMasterSaga),
    fork(historyMasterSaga),
    fork(approveMasterSaga),
  ])
}
