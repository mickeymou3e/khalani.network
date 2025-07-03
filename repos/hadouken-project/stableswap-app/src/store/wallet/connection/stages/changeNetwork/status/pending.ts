import { call, put } from 'typed-redux-saga'

import { initNetworkSaga } from '@store/network/saga/init.saga'
import { checkExpectedNetwork } from '@store/wallet/connection/stages/changeNetwork/validators'
import { checkAccountConnected } from '@store/wallet/connection/validators'
import { walletActions } from '@store/wallet/wallet.slice'

import { ConnectionStageStatus, ConnectionStageType } from '../../../types'

export function* pendingStatusHandler(): Generator {
  const isNetworkInitialized = yield* call(initNetworkSaga)
  const isExpectedNetwork = yield* call(checkExpectedNetwork)
  const isAuthenticated = yield* call(checkAccountConnected)

  if (isNetworkInitialized && isExpectedNetwork) {
    if (!isAuthenticated) {
      yield* put(
        walletActions.changeConnectionStage({
          type: ConnectionStageType.ConnectWallet,
          status: ConnectionStageStatus.Fail,
        }),
      )
    } else {
      yield* put(
        walletActions.changeConnectionStage({
          type: ConnectionStageType.ChangeNetwork,
          status: ConnectionStageStatus.Success,
        }),
      )
    }
  } else {
    yield* put(
      walletActions.changeConnectionStage({
        type: ConnectionStageType.ChangeNetwork,
        status: ConnectionStageStatus.Fail,
      }),
    )
  }
}
