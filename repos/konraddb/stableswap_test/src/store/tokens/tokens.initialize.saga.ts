import { call, put } from 'typed-redux-saga'

import { fetchPoolTokens } from '@dataSource/graph/pools'

import { tokensActions } from './tokens.slice'

export function* initializeTokensSaga(): Generator {
  try {
    const poolTokens = yield* call(fetchPoolTokens)

    yield* put(tokensActions.updateTokensSuccess(poolTokens))
    yield* put(tokensActions.initializeTokensSuccess())
  } catch (error) {
    yield* put(tokensActions.initializeTokensFailure())
    console.error(error)
  }
}
