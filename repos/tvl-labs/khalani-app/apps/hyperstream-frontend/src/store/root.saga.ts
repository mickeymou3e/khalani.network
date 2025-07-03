import { History } from 'history'
import { all, fork } from 'typed-redux-saga'

import {
  approveMasterSaga,
  historyMasterSaga,
  routerSaga,
  walletMasterSaga,
} from '@shared/store'

import { initializeStoreMasterSaga } from './initializeStore/initializeStore.master.saga'
import { intentsMasterSaga } from './intents/intents.master.saga'
import { notificationMasterSaga } from './notification/notification.master.saga'

export function* rootSaga(historyProvider: History): Generator {
  yield all([
    fork(routerSaga, historyProvider),
    fork(initializeStoreMasterSaga),
    fork(walletMasterSaga),
    fork(historyMasterSaga),
    fork(approveMasterSaga),
    fork(notificationMasterSaga),
    fork(intentsMasterSaga),
  ])
}
