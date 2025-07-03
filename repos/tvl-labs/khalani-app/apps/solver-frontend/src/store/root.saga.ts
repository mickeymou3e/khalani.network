import { History } from 'history'
import { all, fork } from 'typed-redux-saga'

import {
  approveMasterSaga,
  initializeStoreMasterSaga,
  routerSaga,
  walletMasterSaga,
} from '@shared/store'

import { intentsMasterSaga } from './intents/intents.master.saga'
import { notificationMasterSaga } from './notification/notification.master.saga'
import { withdrawMasterSaga } from './withdraw/withdraw.master.saga'

export function* rootSaga(historyProvider: History): Generator {
  yield all([
    fork(routerSaga, historyProvider),
    fork(initializeStoreMasterSaga),
    fork(walletMasterSaga),
    fork(approveMasterSaga),
    fork(notificationMasterSaga),
    fork(intentsMasterSaga),
    fork(withdrawMasterSaga),
  ])
}
