import { StrictEffect } from 'redux-saga/effects'
import { call } from 'typed-redux-saga'

import { mapPoolQueryResultToPool } from '@dataSource/graph/pools/pools/mapper'
import { IPool } from '@interfaces/pool'
import { subgraphClient } from '@utils/network/subgraph'
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
  const poolsQueryResult = yield* call<IApolloPoolQueryResult>(
    subgraphClient.query,
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
  const poolsQueryResultData = yield* call(queryPools, {
    poolIds: props?.poolIds,
    blockNumber: props?.block?.number,
  })

  const pools = poolsQueryResultData.pools.map(mapPoolQueryResultToPool)
  // .reduce(reduceByKey<IPool, 'id'>('id'), {} as ByKey<IPool, 'id'>)

  // Object.keys(pools).reduce((volumes, poolId) => {
  //   const pool = pools[poolId]
  //   const pool24h = pools24h?.[poolId]
  //   console.log('[query] pool', pool.name.toString())
  //
  //   const totalSwapVolume = pool.totalSwapVolume
  //   const totalSwapVolume24h = pool24h?.totalSwapVolume
  //   console.log('[query] pool total swap volume', totalSwapVolume.toString())
  //   console.log(
  //     '[query] pool total swap volume 24h',
  //     totalSwapVolume24h.toString(),
  //   )
  //
  //   const volume24h = totalSwapVolume24h
  //     ? totalSwapVolume.sub(totalSwapVolume24h)
  //     : BigDecimal.from(0)
  //
  //   console.log('[query] pool volume', volume24h.toString())
  //   return {
  //     ...volumes,
  //     [poolId]: volume24h,
  //   }
  // }, {} as ByPoolId<BigDecimal>)
  // console.log('[query] pools', pools)
  // console.log('[query] pools 24h', pools24h)

  return pools
}
