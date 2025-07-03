import { takeLatest } from 'redux-saga/effects'
import { all, spawn } from 'typed-redux-saga'

import { handleConnectionStateChange } from './connectionState'
import { observeMetaMaskEvents } from './saga/metaMaskObserver.event'
import { switchNetworkToSupportedSaga } from './saga/switchNetworkSaga'
import { walletActions } from './wallet.slice'

export function* walletMasterSaga(): Generator {
  yield all([
    spawn(observeMetaMaskEvents),
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
