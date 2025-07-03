import { all, call, put } from 'typed-redux-saga'

import { initializeHistorySaga } from '@shared/store/history'

import { initializeStoreActions } from './initializeStore.slice'

export function* initializeStoreSaga(): Generator {
  try {
    yield* all([call(initializeHistorySaga)])

    yield* put(initializeStoreActions.initializeStoreSuccess())
  } catch (error) {
    console.error(error)
    yield* put(initializeStoreActions.initializeStoreFailure())
  }
}
