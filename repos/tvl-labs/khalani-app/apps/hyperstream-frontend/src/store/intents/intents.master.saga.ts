import { takeLatest } from 'redux-saga/effects'
import { all, call } from 'typed-redux-saga'

import {
  createIntentActions,
  createRefineActions,
  queryRefineActions,
} from '@tvl-labs/sdk'

import { createRefineActionHandler } from '../refine/create.actions.saga'
import { queryRefineActionHandler } from '../refine/query.actions.saga'
import { createIntentActionHandler } from './create.actions.saga'

export function* actionHandlers(): Generator {
  yield* all([
    takeLatest(createIntentActions.request.type, createIntentActionHandler),
    takeLatest(createRefineActions.request.type, createRefineActionHandler),
    takeLatest(queryRefineActions.request.type, queryRefineActionHandler),
  ])
}

export function* intentsMasterSaga(): Generator {
  yield all([call(actionHandlers)])
}
