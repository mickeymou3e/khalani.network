import { call, put } from 'redux-saga/effects'
import { logger } from '@utils/logger'
import { select } from 'typed-redux-saga'
import { providerSelector } from '@store/provider/provider.selector'
import { bridgeHistoryActions } from './bridge.slice'
import { getBridgeHistory } from '@graph/history/bridge'
import { IntentEntity } from '@graph/history/types'
import {
  getMedusaHistory,
  MedusaHistory,
} from '@services/medusa/history.service'
import { getStatusBySourceTx } from '@services/hyperlane/getStatusBySourceTx'
import { BridgeHistory } from './bridge.types'

export function* getBridgeHistorySaga(): Generator {
  try {
    const author = yield* select(providerSelector.userAddress)
    if (!author) throw new Error('Author not found')

    yield put(bridgeHistoryActions.request())
    const bridgeHistory: IntentEntity[] = (yield call(
      getBridgeHistory,
      author,
    )) as IntentEntity[]
    const finalHistory: BridgeHistory[] = []
    for (let index = 0; index < bridgeHistory.length; index++) {
      const currentElement = bridgeHistory[index]
      const medusaHistory: MedusaHistory = (yield call(
        getMedusaHistory,
        currentElement.id,
      )) as MedusaHistory

      finalHistory.push({
        intentEntity: currentElement,
        history: medusaHistory,
      })
    }
    yield put(
      bridgeHistoryActions.requestSuccess(finalHistory as BridgeHistory[]),
    )
  } catch (error) {
    yield put(bridgeHistoryActions.requestError((error as Error).toString()))
    logger.error(error)
  }
}
