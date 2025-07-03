import { StrictEffect } from 'redux-saga/effects'
import { call } from 'typed-redux-saga'

import { IPool } from '@interfaces/pool'
import { ByPoolId } from '@store/pool/pool.types'
import { subgraphClient } from '@utils/network/subgraph'
import { Subgraph } from '@utils/network/subgraph.types'

import { mapPoolSnapshotQueryResultDataToPoolSnapshots } from './mapper'
import { POOLS_HADOUKEN_SNAPSHOTS_QUERY, POOLS_QUERY } from './queries'
import {
  IApolloPoolSnapshotRegistryQueryResult,
  IApolloPoolSnapshotsQueryResult,
  IPoolSnapshot,
  IPoolSnapshotQueryResultData,
  IPoolSnapshotRegistryQueryResult,
} from './types'

export function* queryPoolHadoukenSnapshot(
  poolIds: string[],
): Generator<StrictEffect, IPoolSnapshotRegistryQueryResult> {
  const queryResult = yield* call<IApolloPoolSnapshotRegistryQueryResult>(
    subgraphClient.query,
    {
      context: {
        type: Subgraph.Balancer,
      },
      query: POOLS_HADOUKEN_SNAPSHOTS_QUERY,
      variables: {
        where: {
          ...(poolIds ? { id_in: poolIds } : {}),
        },
      },
    },
  )

  return queryResult.data
}

export function* queryPoolSnapshots(
  poolIds: IPool['id'][],
  blockNumber: number,
): Generator<StrictEffect, IPoolSnapshotQueryResultData> {
  const queryResult = yield* call<IApolloPoolSnapshotsQueryResult>(
    subgraphClient.query,
    {
      context: {
        type: Subgraph.Balancer,
      },
      query: POOLS_QUERY,
      variables: {
        where: {
          ...(poolIds ? { id_in: poolIds } : {}),
        },
        block: blockNumber
          ? {
              number: blockNumber,
            }
          : undefined,
      },
    },
  )

  return queryResult.data
}

export function* fetchPoolSnapshots(
  poolIds: IPool['id'][],
  blockNumber: number,
): Generator<StrictEffect, ByPoolId<IPoolSnapshot[]>> {
  const queryResult = yield* call(queryPoolSnapshots, poolIds, blockNumber)

  const poolsSnapshots = yield* call(
    mapPoolSnapshotQueryResultDataToPoolSnapshots,
    poolIds,
    queryResult,
  )

  return poolsSnapshots
}
