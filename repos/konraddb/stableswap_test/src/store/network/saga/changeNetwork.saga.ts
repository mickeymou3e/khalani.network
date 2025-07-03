import { put } from 'typed-redux-saga'

import {
  ConnectionStageStatus,
  ConnectionStageType,
} from '@store/wallet/connection/types'
import { walletActions } from '@store/wallet/wallet.slice'

export function* changeNetwork(): Generator {
  yield* put(
    walletActions.changeConnectionStage({
      type: ConnectionStageType.ChangeNetwork,
      status: ConnectionStageStatus.Pending,
    }),
  )
}
