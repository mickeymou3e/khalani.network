import { call, put } from 'typed-redux-saga'

import { networkActions } from '@store/network/network.slice'
import { initNetworkSaga } from '@store/network/saga/init.saga'
import { checkExpectedNetwork } from '@store/wallet/connection/stages/changeNetwork/validators'
import { checkAccountConnected } from '@store/wallet/connection/validators'
import { walletActions } from '@store/wallet/wallet.slice'

import { ConnectionStageStatus, ConnectionStageType } from '../../../types'
import {
  checkReloadedNetwork,
  checkSupportedNetwork,
} from '../validators/validators'

export function* pendingStatusHandler(): Generator {
  const isNetworkInitialized = yield* call(initNetworkSaga)
  const isExpectedNetwork = yield* call(checkExpectedNetwork)
  const isSupportedNetwork = yield* call(checkSupportedNetwork)

  const isAuthenticated = yield* call(checkAccountConnected)
  const isReloaded = yield* call(checkReloadedNetwork)

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
    yield* put(networkActions.updateReloaded(true))
    yield* put(
      walletActions.changeConnectionStage({
        type: ConnectionStageType.ChangeNetwork,
        status:
          isSupportedNetwork && !isReloaded
            ? ConnectionStageStatus.Success
            : ConnectionStageStatus.Fail,
      }),
    )
  }
}
