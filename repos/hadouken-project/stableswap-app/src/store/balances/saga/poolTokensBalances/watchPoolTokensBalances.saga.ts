import { call, cancelled, put, select, take } from 'typed-redux-saga'

import {
  mapPoolTokensBalancesQueryResultData,
  mapTokensBalancesQueryResult,
} from '@dataSource/graph/pools/poolsBalances/mapper'
import {
  createPoolTokensBalancesChannel,
  createPoolTokensBalancesObservable,
} from '@dataSource/graph/pools/poolsBalances/subscription'
import { IToken } from '@interfaces/token'
import { balancesActions } from '@store/balances/balances.slice'
import { poolSelectors } from '@store/pool/selectors/pool.selector'

export function* watchPoolTokensBalances(
  poolsIds: string[],
  tokens: IToken[],
): Generator {
  const selectPoolsByIds = yield* select(poolSelectors.selectManyByIds)
  const pools = yield* call(selectPoolsByIds, poolsIds)

  const poolTokensBalancesObservable = yield* call(
    createPoolTokensBalancesObservable,
    poolsIds,
  )
  const poolTokensBalancesChannel = yield* call(
    createPoolTokensBalancesChannel,
    poolTokensBalancesObservable,
  )

  try {
    while (true) {
      const data = yield* take(poolTokensBalancesChannel)

      yield* put(balancesActions.updateBalancesRequest())

      const tokensBalances = yield* call(
        mapPoolTokensBalancesQueryResultData,
        data,
        pools.map(({ id, address }) => ({ id, address })),
      )

      const balances = yield* call(
        mapTokensBalancesQueryResult,
        tokens,
        tokensBalances,
      )

      yield* put(balancesActions.updateBalancesSuccess(balances))
    }
  } finally {
    if (yield* cancelled()) {
      poolTokensBalancesChannel.close()
    }
  }
}
