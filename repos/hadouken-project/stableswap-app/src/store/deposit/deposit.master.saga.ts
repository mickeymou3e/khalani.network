import { takeLatest } from 'redux-saga/effects'
import { all } from 'typed-redux-saga'

import { depositRequestSaga } from '@store/deposit/saga/depositRequest.saga'

import { depositActions } from './deposit.slice'
import { depositPreviewRequestSaga } from './saga/depositPreviewRequest.saga'
import { amountChangeSaga } from './saga/editor/amountChangeSaga'
import { initializeDepositSaga } from './saga/editor/initializeDepositSaga'
import { proportionalSuggestionSaga } from './saga/editor/proportionalSuggestionSaga'
import { wrappedTokensChangeSaga } from './saga/editor/wrappedTokensChangeSaga'

export function* depositMasterSaga(): Generator {
  yield all([
    takeLatest(
      depositActions.depositPreviewRequest.type,
      depositPreviewRequestSaga,
    ),
    takeLatest(depositActions.depositRequest.type, depositRequestSaga),

    takeLatest(
      depositActions.initializeDepositRequest.type,
      initializeDepositSaga,
    ),
    takeLatest(depositActions.amountChangeRequest.type, amountChangeSaga),
    takeLatest(
      depositActions.wrappedTokenChangeRequest.type,
      wrappedTokensChangeSaga,
    ),
    takeLatest(
      depositActions.proportionalSuggestionRequest.type,
      proportionalSuggestionSaga,
    ),
  ])
}
