import { History } from 'history'

import { RouterActions } from '../router.slice'

export function* push(
  history: History,
  action: RouterActions['historyPush'],
): Generator {
  yield history.push(action.payload)
}
