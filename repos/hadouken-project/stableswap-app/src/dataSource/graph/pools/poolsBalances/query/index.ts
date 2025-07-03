import { StrictEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { networkSelectors } from '@store/network/network.selector'
import { waitForChainToBeSet } from '@store/wallet/metamask/metaMaskObserver/metaMaskObserver.event'
import { subgraphClients } from '@utils/network/subgraph'
import { Subgraph } from '@utils/network/subgraph.types'

import { mapPoolTokensBalancesQueryResultData } from '../mapper'
import { IApolloPoolTokensBalancesQueryResult, ITokenBalance } from '../types'
import { POOL_TOKEN_BALANCES_QUERY } from './query'

export function* queryPoolTokenBalances(
  poolId?: string,
): Generator<StrictEffect, ITokenBalance[]> {
  yield* call(waitForChainToBeSet)
  const chainId = yield* select(networkSelectors.applicationChainId)
  const queryResult = yield* call<IApolloPoolTokensBalancesQueryResult>(
    subgraphClients[chainId].query,
    {
      fetchPolicy: 'no-cache',
      context: {
        type: Subgraph.Balancer,
      },
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
