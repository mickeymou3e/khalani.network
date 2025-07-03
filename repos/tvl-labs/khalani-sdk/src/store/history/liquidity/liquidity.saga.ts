import { call, put } from 'redux-saga/effects'
import { logger } from '@utils/logger'
import { select } from 'typed-redux-saga'
import { providerSelector } from '@store/provider/provider.selector'
import { liquidityHistoryActions } from './liquidity.slice'
import { getLiquidityHistory } from '@graph/history/liquidity'
import { IntentEntity } from '@graph/history/types'
import {
  getMedusaHistory,
  MedusaHistory,
} from '@services/medusa/history.service'
import { LiquidityHistory } from './liquidity.types'

export function* getLiquidityHistorySaga(): Generator {
  try {
    const author = yield* select(providerSelector.userAddress)
    if (!author) throw new Error('Author not found')

    yield put(liquidityHistoryActions.request())
    const liquidityHistory: IntentEntity[] = (yield call(
      getLiquidityHistory,
      author,
    )) as IntentEntity[]
    const finalHistory: LiquidityHistory[] = []
    for (let index = 0; index < liquidityHistory.length; index++) {
      const currentElement = liquidityHistory[index]
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
      liquidityHistoryActions.requestSuccess(
        finalHistory as LiquidityHistory[],
      ),
    )
  } catch (error) {
    yield put(liquidityHistoryActions.requestError((error as Error).toString()))
    logger.error(error)
  }
}
