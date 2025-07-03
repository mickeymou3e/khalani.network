import { all, takeEvery } from 'typed-redux-saga'

import { initializeStoreSaga } from './initializeStore.saga'
import { initializeStoreActions } from './initializeStore.slice'

export function* initializeStoreMasterSaga(): Generator {
  yield all([
    takeEvery(
      initializeStoreActions.initializeStoreRequest.type,
      initializeStoreSaga,
    ),
  ])
}
