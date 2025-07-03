import { put, select } from 'typed-redux-saga'

import { historySelector } from './history.selector'
import { historyActions } from './history.slice'

export function* initializeHistorySaga(): Generator {
  try {
    const inProgress = yield* select(historySelector.inProgress)

    yield* put(historyActions.toggleBadge(false))
    yield* put(historyActions.toggleHistoryDropdown(false))

    if (inProgress) {
      yield* put(historyActions.closeUnfinishedTransactions())
    }

    yield* put(historyActions.clearOldTransactions())
  } catch (error) {
    console.error(error)
  }
}
