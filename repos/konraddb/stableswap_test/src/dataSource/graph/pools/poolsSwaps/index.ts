import { constants } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call } from 'typed-redux-saga'

import { BigDecimal } from '@utils/math'
import { subgraphClient } from '@utils/network/subgraph'
import { Subgraph } from '@utils/network/subgraph.types'

import { POOL_SWAPS_QUERY } from './queries'
import {
  IApolloPoolSwapsQueryResult,
  IPoolSwapQueryResult,
  IPoolSwapsQueryResult,
  IPoolVolume,
} from './types'

export function* queryPoolsSwaps({
  poolId,
  userAddress,
  timestamp,
}: {
  poolId: string
  userAddress: string
  timestamp?: number
}): Generator<StrictEffect, IPoolSwapsQueryResult> {
  const queryResult = yield* call<IApolloPoolSwapsQueryResult>(
    subgraphClient.query,
    {
      context: {
        type: Subgraph.Balancer,
      },
      query: POOL_SWAPS_QUERY,
      variables: {
        poolId,
        userAddress,
        timestamp,
      },
    },
  )

  return queryResult.data
}

export function mapPoolsSwaps(swaps: IPoolSwapQueryResult[]): IPoolVolume[] {
  const volumes = swaps.reduce((volumes, swap) => {
    const {
      poolId: { id: swapPoolId },
      timestamp,
      tokenAmountIn,
    } = swap

    const tokenAmountInBD = BigDecimal.fromString(tokenAmountIn)

    const poolVolume = volumes.find(({ poolId }) => poolId === swapPoolId)
    if (!poolVolume) {
      const newPoolVolume: IPoolVolume = {
        id: swapPoolId,
        poolId: swapPoolId,
        timeStamp: String(timestamp),
        utcDay: '',
        volume: tokenAmountInBD.toString(),
      }
      return [...volumes, newPoolVolume]
    }

    poolVolume.volume = BigDecimal.fromString(poolVolume.volume)
      .add(tokenAmountInBD)
      .toString()

    return [...volumes]
  }, [] as IPoolVolume[])

  return volumes
}

// export function* fetchPoolSwaps({
//   poolId,
//   userAddress,
//   timestamp,
// }: {
//   poolId: IPool['id']
//   userAddress: Address
//   timestamp?: number
// }): Generator<StrictEffect, IPoolVolume[]> {
//   const {
//     last24hSwaps,
//     latest10Swaps,
//     userLatest10Swaps,
//   } = yield* call(queryPoolsSwaps, { poolId, userAddress, timestamp })

//   // const volumes = yield* call(mapPoolsSwaps, swaps)
//   //
//   return []
// }

export function* fetchPoolsVolume({
  poolIds,
  timestamp,
}: {
  poolIds: string[]
  timestamp?: number
}): Generator<StrictEffect, IPoolVolume[]> {
  yield* call(queryPoolsSwaps, {
    poolId: poolIds[0],
    userAddress: constants.AddressZero,
    timestamp,
  })
  return []
}
