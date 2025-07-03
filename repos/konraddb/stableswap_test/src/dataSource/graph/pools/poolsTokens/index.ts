import { Effect, StrictEffect } from 'redux-saga/effects'
import { call } from 'typed-redux-saga'

import { subgraphClient } from '@utils/network/subgraph'
import { Subgraph } from '@utils/network/subgraph.types'

import { mapPoolTokensQueryResultData } from './mapper'
import { TOKENS_QUERY } from './queries'
import { IApolloTokenQueryResult, IPoolToken, ITokenQueryResult } from './types'

export function* queryPoolTokens(): Generator<StrictEffect, ITokenQueryResult> {
  const queryResult = yield* call<IApolloTokenQueryResult>(
    subgraphClient.query,
    {
      context: {
        type: Subgraph.Balancer,
      },
      query: TOKENS_QUERY,
    },
  )

  return queryResult.data
}

export function* fetchPoolTokens(): Generator<Effect, IPoolToken[]> {
  const queryResult = yield* call(queryPoolTokens)

  const poolTokens = yield* call(mapPoolTokensQueryResultData, queryResult)

  return poolTokens
}
