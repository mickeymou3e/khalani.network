import { call } from 'typed-redux-saga'

import { ConnectionStage, ConnectionStageStatus } from '../../types'
import { successStatusHandler, pendingStatusHandler } from './status'

export function* changeNetworkConnectionStageHandler(
  stage: ConnectionStage,
): Generator {
  if (stage.status === ConnectionStageStatus.Pending) {
    yield* call(pendingStatusHandler)
  } else if (stage.status === ConnectionStageStatus.Success) {
    yield* call(successStatusHandler)
  }
}
