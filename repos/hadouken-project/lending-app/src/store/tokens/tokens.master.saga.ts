import { all, takeEvery } from 'typed-redux-saga'

import { initializeTokensSagaRpcCall } from './tokens.initialize.saga'
import { tokensActions } from './tokens.slice'

export function* tokensMasterSaga(): Generator {
  yield all([
    takeEvery(
      tokensActions.fetchApplicationsTokensRequest.type,
      initializeTokensSagaRpcCall,
    ),
  ])
}
