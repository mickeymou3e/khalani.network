import { call, put } from 'typed-redux-saga'

import { fetchPoolTokens } from '@dataSource/graph/pools'
import { fetchBackstopTokenSaga } from '@store/backstop/saga/token/fetchBackstopToken.saga'
import { fetchHadoukenTokenSaga } from '@store/lockDrop/saga/fetchHadoukenToken.saga'

import { tokensActions } from './tokens.slice'

export function* initializeTokensSaga(): Generator {
  try {
    const poolTokens = yield* call(fetchPoolTokens)

    const backstopToken = yield* call(fetchBackstopTokenSaga)

    const hadoukenToken = yield* call(fetchHadoukenTokenSaga)

    const allTokens = backstopToken
      ? [...poolTokens, backstopToken]
      : poolTokens

    if (hadoukenToken) {
      allTokens.push(hadoukenToken)
    }

    yield* put(tokensActions.updateTokensSuccess(allTokens))
    yield* put(tokensActions.initializeTokensSuccess())
  } catch (error) {
    yield* put(tokensActions.initializeTokensFailure())
    console.error(error)
  }
}
