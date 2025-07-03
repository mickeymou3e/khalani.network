import { select, put, delay } from 'typed-redux-saga'

import { historySelector } from './history.selector'
import { historyActions } from './history.slice'

export function* toggleBadge(): Generator {
  const inProgress = yield* select(historySelector.inProgress)
  const showBadge = yield* select(historySelector.showBadge)

  if (inProgress) {
    yield* put(historyActions.toggleBadge(true))
    yield* put(historyActions.toggleHistoryDropdown(true))
  } else if (!inProgress && showBadge) {
    yield* delay(1000 * 15)
    yield* put(historyActions.toggleBadge(false))
    yield* put(historyActions.toggleHistoryDropdown(false))
  }
}
