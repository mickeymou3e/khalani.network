import { takeLatest } from 'redux-saga/effects'
import { all, call } from 'typed-redux-saga'

import {
  withdrawIntentBalanceActions,
  withdrawMTokenActions,
} from '@tvl-labs/sdk'

import { createWithdrawIntentBalanceActionHandler } from './withdrawIntentBalanceHandler.saga'
import { createWithdrawMTokenActionHandler } from './withdrawMTokenHandler.saga'

export function* actionHandlers(): Generator {
  yield* all([
    takeLatest(
      withdrawMTokenActions.withdrawMTokenRequest.type,
      createWithdrawMTokenActionHandler,
    ),
    takeLatest(
      withdrawIntentBalanceActions.withdrawIntentBalanceRequest.type,
      createWithdrawIntentBalanceActionHandler,
    ),
  ])
}

export function* withdrawMasterSaga(): Generator {
  yield all([call(actionHandlers)])
}
