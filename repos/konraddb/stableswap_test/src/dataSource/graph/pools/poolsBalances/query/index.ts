import { StrictEffect } from 'redux-saga/effects'
import { call } from 'typed-redux-saga'

import { subgraphClient } from '@utils/network/subgraph'
import { Subgraph } from '@utils/network/subgraph.types'

import { mapPoolTokensBalancesQueryResultData } from '../mapper'
import { IApolloPoolTokensBalancesQueryResult, ITokenBalance } from '../types'
import { POOL_TOKEN_BALANCES_QUERY } from './query'

export function* queryPoolTokenBalances(
  poolId?: string,
): Generator<StrictEffect, ITokenBalance[]> {
  const queryResult = yield* call<IApolloPoolTokensBalancesQueryResult>(
    subgraphClient.query,
    {
      context: {
        type: Subgraph.Balancer,
      },
      fetchPolicy: 'network-only',
      query: POOL_TOKEN_BALANCES_QUERY,
      variables: {
        poolId: poolId,
      },
    },
  )

  const poolTokensBalances = yield* call(
    mapPoolTokensBalancesQueryResultData,
    queryResult.data,
    queryResult.data.pools,
  )

  return poolTokensBalances
}

export function* fetchPoolTokenBalances(
  poolId: string,
): Generator<StrictEffect, ITokenBalance[]> {
  const poolTokensBalances = yield* call(queryPoolTokenBalances, poolId)

  return poolTokensBalances
}
