import { History } from 'history'
import { call, all, fork, takeLatest } from 'typed-redux-saga'

import { push } from './push/push.saga'
import { watchLocationChange } from './push/watchLocationChange.saga'
import { Router } from './router.slice'

export function* watchers(history: History): Generator {
  yield* all([fork(watchLocationChange, history)])
}

export function* actionHandlers(history: History): Generator {
  yield all([takeLatest(Router.HISTORY_PUSH, push, history)])
}

export function* routerSaga(history: History): Generator {
  yield all([call(actionHandlers, history), call(watchers, history)])
}
