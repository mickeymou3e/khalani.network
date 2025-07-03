import { takeLatest } from 'redux-saga/effects'
import { all, call } from 'typed-redux-saga'

import { swapActions } from '@store/swap/swap.slice'

import { initializeSwapStoreSaga } from './saga/initializeSwapStore.saga'
import { onInputChangeSaga } from './saga/onInputChange.saga'
import { onQuoteTokenChange } from './saga/onQuoteTokenChange.saga'
import { swapPreviewRequestActionHandler } from './saga/swapPreviewRequest.saga'
import { swapRequestActionHandler } from './saga/swapRequest.saga'

export function* actionHandlers(): Generator {
  yield* all([
    takeLatest(swapActions.swapRequest, swapRequestActionHandler),
    takeLatest(
      swapActions.initializeSwapStoreRequest.type,
      initializeSwapStoreSaga,
    ),
    takeLatest(swapActions.onInputChange.type, onInputChangeSaga),
    takeLatest(swapActions.setQuoteToken.type, onQuoteTokenChange),
    takeLatest(swapActions.swapPreviewRequest, swapPreviewRequestActionHandler),
  ])
}

export function* swapMasterSaga(): Generator {
  yield all([call(actionHandlers)])
}
