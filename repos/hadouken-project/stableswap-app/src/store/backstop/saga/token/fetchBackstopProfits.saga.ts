import { Effect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { fetchLiquidations } from '@dataSource/graph/backstop'
import { networkSelectors } from '@store/network/network.selector'
import { BigDecimal } from '@utils/math'

// TODO not used right now
export function* fetchBackstopProfitsSaga(
  blockNumber?: number,
): Generator<Effect, BigDecimal> {
  const chainId = yield* select(networkSelectors.applicationChainId)

  const liquidations = yield* call(
    fetchLiquidations,
    chainId,
    null, // fetch all
    0, // skip 0
    blockNumber,
  )

  const totalProfit = liquidations.reduce((sum, current) => {
    return sum.add(BigDecimal.from(current.profit.toBigNumber()))
  }, BigDecimal.from(0))

  return totalProfit
}
