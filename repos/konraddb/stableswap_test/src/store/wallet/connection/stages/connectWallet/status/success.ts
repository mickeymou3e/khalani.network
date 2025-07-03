import { put } from 'typed-redux-saga'

import { walletActions } from '@store/wallet/wallet.slice'

import { ConnectionStageType, ConnectionStageStatus } from '../../../types'

export function* successStatusHandler(): Generator {
  yield* put(
    walletActions.changeConnectionStage({
      type: ConnectionStageType.ChangeNetwork,
      status: ConnectionStageStatus.Pending,
    }),
  )
}
