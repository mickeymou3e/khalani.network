import { History } from 'history'
import { all, takeLatest } from 'typed-redux-saga'

import { push } from './push/push.saga'
import { Router } from './router.slice'

export function* actionHandlers(history: History): Generator {
  yield all([takeLatest(Router.HISTORY_PUSH, push, history)])
}
