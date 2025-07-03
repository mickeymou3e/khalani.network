import { all, spawn, takeEvery, takeLatest } from 'typed-redux-saga'

import { handleConnectionStageChangeSaga } from './connection'
import { observeMetaMaskEvents } from './metamask/metaMaskObserver/metaMaskObserver.event'
import { switchMetamaskNetworkSaga } from './metamask/switchMetaMaskNetwork/switchMetaMaskNetwork.saga'
import { initializeWalletSaga } from './wallet.initialize.saga'
import { walletActions } from './wallet.slice'

export function* walletMasterSaga(): Generator {
  yield all([
    spawn(observeMetaMaskEvents),
    takeEvery(walletActions.initializeWalletRequest.type, initializeWalletSaga),
    takeLatest(
      walletActions.switchMetamaskNetwork.type,
      switchMetamaskNetworkSaga,
    ),
    takeLatest(
      walletActions.changeConnectionStage.type,
      handleConnectionStageChangeSaga,
    ),
  ])
}
