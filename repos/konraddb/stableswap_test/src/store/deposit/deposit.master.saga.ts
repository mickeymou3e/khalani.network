import { takeLatest } from 'redux-saga/effects'
import { all, call } from 'typed-redux-saga'

import { depositRequestActionHandler } from '@store/deposit/saga/depositRequest.saga'

import { depositActions } from './deposit.slice'
import { depositPreviewRequestActionHandler } from './saga/depositPreviewRequest.saga'

export function* actionHandlers(): Generator {
  yield* all([
    takeLatest(
      depositActions.depositPreviewRequest.type,
      depositPreviewRequestActionHandler,
    ),
    takeLatest(depositActions.depositRequest.type, depositRequestActionHandler),
  ])
}

export function* depositMasterSaga(): Generator {
  yield all([call(actionHandlers)])
}
