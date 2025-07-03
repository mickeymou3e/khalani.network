import { logger } from '@utils/logger'
import { providerSelector } from '@store/provider/provider.selector'
import { depositHistoryActions } from './depositHistory.slice'

import { call, put, select } from 'typed-redux-saga'
import { DepositRecord, listDeposits } from '@services/deposit'

export function* getDepositHistorySaga(): Generator {
  try {
    const author = yield* select(providerSelector.userAddress)
    if (!author) {
      return
    }

    yield put(depositHistoryActions.request())
    const deposits: DepositRecord[] = yield* call(listDeposits, author)

    yield put(depositHistoryActions.requestSuccess(deposits))
  } catch (error) {
    yield put(depositHistoryActions.requestError((error as Error).toString()))
    logger.error(error)
  }
}
