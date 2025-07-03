import { StrictEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { PoolType } from '@interfaces/pool'
import { waitForPoolsAndTokensBeFetched } from '@store/deposit/saga/editor/utils'
import { networkSelectors } from '@store/network/network.selector'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { waitForChainToBeSet } from '@store/wallet/metamask/metaMaskObserver/metaMaskObserver.event'
import { subgraphClients } from '@utils/network/subgraph'
import { Subgraph } from '@utils/network/subgraph.types'

import { mapComposableJoinExitQueryResult } from './mapper'
import {
  COMPOSABLE_POOL_JOIN_EXITS_QUERY,
  WEIGHTED_POOL_JOIN_EXITS_QUERY,
} from './query'
import {
  IApollPoolJoinsExitsQueryResult,
  IJoinExit,
  IJoinExitQueryResult,
  IJoinExitQueryResultComposableStable,
  IQueryPoolJoinsExits,
} from './types'

export function* queryPoolJoinsExits({
  poolId,
  userId,
  limit,
  skip,
}: IQueryPoolJoinsExits): Generator<StrictEffect, IJoinExit[]> {
  yield* call(waitForPoolsAndTokensBeFetched)
  yield* call(waitForChainToBeSet)

  const selectPool = yield* select(poolSelectors.selectById)

  const pool = selectPool(poolId)

  if (!pool) return []

  const isWeightedPool =
    pool.poolType === PoolType.Weighted ||
    pool.poolType === PoolType.WeightedBoosted

  const chainId = yield* select(networkSelectors.applicationChainId)
  if (isWeightedPool) {
    const poolJoinsExitsQueryResult = yield* call<
      IApollPoolJoinsExitsQueryResult<IJoinExitQueryResult>
    >(subgraphClients[chainId].query, {
      fetchPolicy: 'no-cache',
      context: {
        type: Subgraph.Balancer,
      },
      query: WEIGHTED_POOL_JOIN_EXITS_QUERY,
      variables: {
        where: {
          ...(userId ? { pool: poolId, sender: userId } : { pool: poolId }),
        },
        limit,
        skip: skip.joins + skip.exits,
      },
    })

    return poolJoinsExitsQueryResult.data.joinExits
  } else {
    const poolJoinsExitsQueryResultDeposit = yield* call<
      IApollPoolJoinsExitsQueryResult<IJoinExitQueryResultComposableStable>
    >(subgraphClients[chainId].query, {
      fetchPolicy: 'no-cache',
      context: {
        type: Subgraph.Balancer,
      },
      query: COMPOSABLE_POOL_JOIN_EXITS_QUERY,
      variables: {
        whereJoins: {
          ...(userId
            ? { poolId, userAddress: userId, tokenOut: pool.address }
            : { poolId, tokenOut: pool.address }),
        },
        whereExits: {
          ...(userId
            ? { poolId, userAddress: userId, tokenIn: pool.address }
            : { poolId, tokenIn: pool.address }),
        },
        limit,
        skipJoins: skip.joins,
        skipExits: skip.exits,
      },
    })

    const joinExits = [
      ...poolJoinsExitsQueryResultDeposit.data.exits,
      ...poolJoinsExitsQueryResultDeposit.data.joins,
    ]
    return mapComposableJoinExitQueryResult(joinExits, pool.address)
  }
}
