import { call, put } from 'typed-redux-saga'

import { lockService } from '@libs/services/lock.service'

import { khalaTokensActions } from './tokens.slice'

export function* initializeKhalaTokensSaga(): Generator {
  yield* put(khalaTokensActions.initializeKhalaTokensRequest())
  try {
    const tokens = yield* call(lockService.getTokens)
    yield* put(khalaTokensActions.updateKhalaTokens(tokens))
    yield* put(khalaTokensActions.initializeKhalaTokensSuccess())
  } catch (error) {
    yield* put(khalaTokensActions.initializeKhalaTokensFailure())
    console.error(error)
  }
}
