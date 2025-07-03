import { takeLatest } from 'redux-saga/effects'
import { all, call } from 'typed-redux-saga'

import { createIntentActions, depositActions } from '@tvl-labs/sdk'

import { createIntentActionHandler } from './create.actions.saga'
import { depositTokensActionHandler } from './deposit.actions.saga'

export function* actionHandlers(): Generator {
  yield* all([
    takeLatest(createIntentActions.request.type, createIntentActionHandler),
    takeLatest(depositActions.request.type, depositTokensActionHandler),
  ])
}

export function* intentsMasterSaga(): Generator {
  yield all([call(actionHandlers)])
}
