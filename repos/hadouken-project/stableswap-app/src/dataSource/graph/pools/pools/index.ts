import { StrictEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { mapPoolsQuery } from '@dataSource/graph/pools/pools/mapper'
import { IPool } from '@interfaces/pool'
import { lendingSelectors } from '@store/lending/lending.selector'
import { networkSelectors } from '@store/network/network.selector'
import { waitForChainToBeSet } from '@store/wallet/metamask/metaMaskObserver/metaMaskObserver.event'
import { subgraphClients } from '@utils/network/subgraph'
import { Subgraph } from '@utils/network/subgraph.types'

import { POOLS_QUERY } from './queries'
import { IApolloPoolQueryResult, IPoolsQueryResultData } from './types'

export function* queryPools({
  poolIds,
  blockNumber,
}: {
  poolIds?: IPool['id'][]
  blockNumber?: number
}): Generator<StrictEffect, IPoolsQueryResultData> {
  yield* call(waitForChainToBeSet)
  const chainId = yield* select(networkSelectors.applicationChainId)

  const poolsQueryResult = yield* call<IApolloPoolQueryResult>(
    subgraphClients[chainId].query,
    {
      fetchPolicy: 'no-cache',
      context: {
        type: Subgraph.Balancer,
      },
      query: POOLS_QUERY,
      variables: {
        ...(poolIds
          ? {
              where: {
                id_in: poolIds,
              },
            }
          : {}),
        ...(blockNumber
          ? {
              block: {
                number: blockNumber,
              },
            }
          : {}),
      },
    },
  )

  return poolsQueryResult.data
}

export function* fetchPools(props?: {
  poolIds?: IPool['id'][]
  block?: { number: number }
}): Generator<StrictEffect, IPool[]> {
  yield* call(waitForChainToBeSet)

  const poolsQueryResultData = yield* call(queryPools, {
    poolIds: props?.poolIds,
    blockNumber: props?.block?.number,
  })

  const lendingReserves = yield* select(lendingSelectors.selectAllReserves)
  const chainId = yield* select(networkSelectors.applicationChainId)

  const pools = mapPoolsQuery(
    poolsQueryResultData.pools,
    lendingReserves,
    chainId,
  )

  return pools
}
