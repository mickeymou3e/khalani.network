import { call } from 'typed-redux-saga'

import {
  ConnectionStage,
  ConnectionStageStatus,
  SelectWalletPendingPayload,
} from '../../types'
import { successStatusHandler, pendingStatusHandler } from './status'

export function* selectWalletConnectionStageHandler(
  stage: ConnectionStage,
): Generator {
  if (stage.status === ConnectionStageStatus.Pending) {
    yield* call(
      pendingStatusHandler,
      stage.payload as SelectWalletPendingPayload,
    )
  } else if (stage.status === ConnectionStageStatus.Success) {
    yield* call(successStatusHandler)
  }
}
