import { logger } from '@utils/logger'
import { providerSelector } from '@store/provider/provider.selector'
import { intentsActions } from './intents.slice'
import { getIntentIdsByAuthor } from '@services/medusa/intents.service'
import {
  getMedusaHistory,
  MedusaHistory,
} from '@services/medusa/history.service'
import { call, put, select } from 'typed-redux-saga'
import { mapToIntentHistory } from './intents.utils'
import { IntentHistory } from './intents.types'

export function* getIntentsHistorySaga(customProxyUrl?: string): Generator {
  try {
    const author = yield* select(providerSelector.userAddress)
    if (!author) {
      return
    }

    yield put(intentsActions.request())
    const intentIds: string[] = (yield call(
      getIntentIdsByAuthor,
      author,
      customProxyUrl,
    )) as string[]

    const history: IntentHistory[] = []

    for (const intentId of intentIds) {
      try {
        const currentIntentHistory = (yield call(
          getMedusaHistory,
          intentId,
          customProxyUrl,
        )) as MedusaHistory
        history.push(mapToIntentHistory(currentIntentHistory, intentId))
      } catch (e) {
        console.error(`Error fetching history for intent ${intentId}:`, e)
      }
    }

    yield put(intentsActions.requestSuccess(history as any))
  } catch (error) {
    yield put(intentsActions.requestError((error as Error).toString()))
    logger.error(error)
  }
}
