import { call, put } from 'typed-redux-saga'

import { fetchBlock } from '@dataSource/graph/blocks'
import { fetchPools } from '@dataSource/graph/pools'
import { getTimestampTimeAgo, HOUR } from '@utils/date'

import { poolsHistoryActions } from '../../poolHistory.slice'

export function* updateSaga(): Generator {
  try {
    const timestamp24h = yield* call(getTimestampTimeAgo, HOUR * 24)
    const block24h = yield* call(fetchBlock, timestamp24h)

    const pools = yield* call(fetchPools, { block: block24h })

    yield* put(poolsHistoryActions.updateSuccess(pools))
  } catch (error) {
    yield* put(poolsHistoryActions.updateError())
    console.error(error)
  }
}
