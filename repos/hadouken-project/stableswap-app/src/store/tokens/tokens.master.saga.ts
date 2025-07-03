import { all, takeEvery } from 'typed-redux-saga'

import { mintTokenSaga } from './mint/mint.saga'
import { initializeTokensSaga } from './tokens.initialize.saga'
import { tokensActions } from './tokens.slice'

export function* tokensMasterSaga(): Generator {
  yield all([
    takeEvery(tokensActions.initializeTokensRequest.type, initializeTokensSaga),
    takeEvery(tokensActions.mintTokenRequest.type, mintTokenSaga),
  ])
}
