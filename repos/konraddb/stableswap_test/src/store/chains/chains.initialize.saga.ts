import { call } from 'typed-redux-saga'

import { getChainsSaga } from './saga/getChains.saga'

export function* initializeChainsSaga(): Generator {
  yield* call(getChainsSaga)
}
