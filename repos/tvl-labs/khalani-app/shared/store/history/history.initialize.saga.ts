import { put, select } from 'typed-redux-saga'

import { historySelector } from './history.selector'
import { historyActions } from './history.slice'

export function* initializeHistorySaga(): Generator {
  try {
    const inProgress = yield* select(historySelector.inProgress)

    if (inProgress) {
      yield* put(historyActions.closeUnfinishedTransactions())
    }
  } catch (error) {
    console.error(error)
  }
}
