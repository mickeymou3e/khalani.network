import { call, put } from 'typed-redux-saga'

import { checkAccountConnected } from '@store/wallet/connection/validators'
import { waitForChainToBeSet } from '@store/wallet/metamask/metaMaskObserver/metaMaskObserver.event'
import { walletActions } from '@store/wallet/wallet.slice'

import { ConnectionStageType, ConnectionStageStatus } from '../../../types'

export function* pendingStatusHandler(): Generator {
  yield* call(waitForChainToBeSet)

  const accountConnected = yield* call(checkAccountConnected)
  if (accountConnected) {
    yield* put(
      walletActions.changeConnectionStage({
        type: ConnectionStageType.SelectWallet,
        status: ConnectionStageStatus.Success,
      }),
    )
  } else {
    yield* put(
      walletActions.changeConnectionStage({
        type: ConnectionStageType.SelectWallet,
        status: ConnectionStageStatus.Pending,
      }),
    )
  }
}
