import { call } from 'typed-redux-saga'

import { updateSaga as updatePoolsHistorySaga } from '@store/poolHistory/saga/update/update.saga'

import { updateSaga } from '../update/update.saga'

export function* initializePoolsSaga(): Generator {
  yield* call(updateSaga)
  yield* call(updatePoolsHistorySaga)
}
