import { Effect, StrictEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { lendingSelectors } from '@store/lending/lending.selector'
import { networkSelectors } from '@store/network/network.selector'
import { waitForChainToBeSet } from '@store/wallet/metamask/metaMaskObserver/metaMaskObserver.event'
import { subgraphClients } from '@utils/network/subgraph'
import { Subgraph } from '@utils/network/subgraph.types'

import { mapPoolTokensQueryResultData } from './mapper'
import { TOKENS_QUERY } from './queries'
import { IApolloTokenQueryResult, IPoolToken, ITokenQueryResult } from './types'

export function* queryPoolTokens(): Generator<StrictEffect, ITokenQueryResult> {
  yield* call(waitForChainToBeSet)
  const chainId = yield* select(networkSelectors.applicationChainId)
  const queryResult = yield* call<IApolloTokenQueryResult>(
    subgraphClients[chainId].query,
    {
      fetchPolicy: 'no-cache',
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

  const lendingReserves = yield* select(lendingSelectors.selectAllReserves)
  const chainId = yield* select(networkSelectors.applicationChainId)

  const poolTokens = yield* call(mapPoolTokensQueryResultData, {
    poolTokens: queryResult.poolTokens,
    poolLpTokens: queryResult.poolLpTokens,
    lendingReserves: lendingReserves,
    chainId,
  })

  return poolTokens
}
