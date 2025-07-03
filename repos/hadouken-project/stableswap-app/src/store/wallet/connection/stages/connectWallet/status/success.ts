import { put } from 'typed-redux-saga'

import { walletActions } from '@store/wallet/wallet.slice'

import { ConnectionStageStatus, ConnectionStageType } from '../../../types'

export function* successStatusHandler(): Generator {
  yield* put(
    walletActions.changeConnectionStage({
      type: ConnectionStageType.ChangeNetwork,
      status: ConnectionStageStatus.Pending,
    }),
  )
}
