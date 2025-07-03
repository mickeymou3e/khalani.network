import { apply, call, put, select } from 'typed-redux-saga'

import { fetchPools } from '@dataSource/graph/pools'

import { HOUR, getTimestampTimeAgo } from '../../../../utils/date'
import { providerSelector } from '../../../provider/provider.selector'
import { poolsHistoryActions } from '../../poolHistory.slice'

export function* updateSaga(): Generator {
  try {
    const provider = yield* select(providerSelector.fallbackProvider)

    const latestBlock = yield* apply(provider, provider.getBlock, ['latest'])
    const blockBefore = yield* apply(provider, provider.getBlock, [
      latestBlock.number - 1000,
    ])
    const avgBlockTime = (latestBlock.timestamp - blockBefore.timestamp) / 1000
    const timestamp7d = getTimestampTimeAgo(HOUR * 24 * 7)
    const blockDiff = Math.floor(
      (Date.now() / 1000 - timestamp7d) / avgBlockTime,
    )
    const block7d = latestBlock.number - blockDiff

    const pools = yield* call(fetchPools, { block: { number: block7d } })

    yield* put(poolsHistoryActions.updateSuccess(pools))
  } catch (error) {
    yield* put(poolsHistoryActions.updateError())
    console.error(error)
  }
}
