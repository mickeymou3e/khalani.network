import { all, call, takeLatest } from 'typed-redux-saga'

import { withdrawPreviewRequestActionHandler } from '@store/withdraw/saga/withdrawPreviewRequest.saga'
import { withdrawRequestActionHandler } from '@store/withdraw/saga/withdrawRequest.saga'
import { withdrawActions } from '@store/withdraw/withdraw.slice'

export function* actionHandlers(): Generator {
  yield* all([
    takeLatest(
      withdrawActions.withdrawPreviewRequest,
      withdrawPreviewRequestActionHandler,
    ),
    takeLatest(withdrawActions.withdrawRequest, withdrawRequestActionHandler),
  ])
}

export function* withdrawMasterSaga(): Generator {
  yield all([call(actionHandlers)])
}
