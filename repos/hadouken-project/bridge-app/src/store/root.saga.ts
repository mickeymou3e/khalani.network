import { all, fork } from 'typed-redux-saga'

import { initializeStoreMasterSaga } from './initializeStore/initializeStore.master.saga'
import { networkMasterSaga } from './network/network.master.saga'
import { walletMasterSaga } from './wallet/wallet.master.saga'

export function* rootSaga(): Generator {
  yield all([
    fork(initializeStoreMasterSaga),
    fork(walletMasterSaga),
    fork(networkMasterSaga),
  ])
}
