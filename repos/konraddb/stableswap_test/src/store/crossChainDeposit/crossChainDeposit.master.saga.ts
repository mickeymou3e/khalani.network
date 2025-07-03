import { takeLatest } from 'redux-saga/effects'
import { all, call } from 'typed-redux-saga'

import { crossChainDepositRequestActionHandler } from '@store/crossChainDeposit/saga/crossChainDepositRequest.saga'

import { crossChainDepositActions } from './crossChainDeposit.slice'
import { crossChainDepositPreviewRequestActionHandler } from './saga/crossChainDepositPreviewRequest.saga'

export function* actionHandlers(): Generator {
  yield* all([
    takeLatest(
      crossChainDepositActions.depositPreviewRequest.type,
      crossChainDepositPreviewRequestActionHandler,
    ),
    takeLatest(
      crossChainDepositActions.depositRequest,
      crossChainDepositRequestActionHandler,
    ),
  ])
}

export function* crossChainDepositMasterSaga(): Generator {
  yield all([call(actionHandlers)])
}
