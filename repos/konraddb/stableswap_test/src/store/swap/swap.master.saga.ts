import { takeLatest } from 'redux-saga/effects'
import { all, call } from 'typed-redux-saga'

import { swapActions } from '@store/swap/swap.slice'

import { swapPreviewRequestActionHandler } from './saga/swapPreviewRequest.saga'
import { swapRequestActionHandler } from './saga/swapRequest.saga'

export function* actionHandlers(): Generator {
  yield* all([
    takeLatest(
      swapActions.swapPreviewRequest.type,
      swapPreviewRequestActionHandler,
    ),
    takeLatest(swapActions.swapRequest, swapRequestActionHandler),
  ])
}

export function* swapMasterSaga(): Generator {
  yield all([call(actionHandlers)])
}
