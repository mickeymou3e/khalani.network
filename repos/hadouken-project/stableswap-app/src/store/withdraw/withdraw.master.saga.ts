import { all, call, takeLatest } from 'typed-redux-saga'

import { withdrawRequestActionHandler } from '@store/withdraw/saga/withdrawRequest.saga'
import { withdrawActions } from '@store/withdraw/withdraw.slice'

import { calculateComposablePoolProportionalWithdrawSaga } from './saga/composablePool/calculateComposablePoolProportionalWithdraw.saga'
import { amountChangeSaga } from './saga/withdrawAmountChange.saga'
import { initializeWithdrawSaga } from './saga/withdrawInitialize.saga'
import { withdrawPreviewRequestSaga } from './saga/withdrawPreviewRequest.saga'
import { wrappedTokensChange } from './saga/wrappedTokensChanges.saga'

export function* actionHandlers(): Generator {
  yield* all([
    takeLatest(
      withdrawActions.withdrawInitializeRequest.type,
      initializeWithdrawSaga,
    ),

    takeLatest(withdrawActions.withdrawRequest, withdrawRequestActionHandler),

    takeLatest(
      withdrawActions.calculateComposablePoolProportionalWithdrawRequest,
      calculateComposablePoolProportionalWithdrawSaga,
    ),
    takeLatest(withdrawActions.amountChangeRequest, amountChangeSaga),
    takeLatest(
      withdrawActions.withdrawPreviewRequest,
      withdrawPreviewRequestSaga,
    ),
    takeLatest(withdrawActions.wrappedTokenChangeRequest, wrappedTokensChange),
  ])
}

export function* withdrawMasterSaga(): Generator {
  yield all([call(actionHandlers)])
}
