import { takeLatest } from 'redux-saga/effects'
import { all, spawn } from 'typed-redux-saga'

import { observeMetaMaskEvents } from './actions/metaMaskObserver.event'
import { switchNetworkToSupportedSaga } from './actions/switchNetworkSaga'
import { handleConnectionStateChange } from './connectionState'
import { initializeWalletSaga } from './wallet.initialize.saga'
import { walletActions } from './wallet.slice'

export function* walletMasterSaga(): Generator {
  yield all([
    spawn(observeMetaMaskEvents),
    takeLatest(
      walletActions.initializeWalletRequest.type,
      initializeWalletSaga,
    ),
    takeLatest(
      walletActions.switchNetworkToSupported.type,
      switchNetworkToSupportedSaga,
    ),
    takeLatest(
      walletActions.changeConnectionStateStatus.type,
      handleConnectionStateChange,
    ),
  ])
}
