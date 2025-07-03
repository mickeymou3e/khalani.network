import { StrictEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { IPool } from '@interfaces/pool'
import { networkSelectors } from '@store/network/network.selector'
import { ByPoolId } from '@store/pool/pool.types'
import { waitForChainToBeSet } from '@store/wallet/metamask/metaMaskObserver/metaMaskObserver.event'
import { subgraphClients } from '@utils/network/subgraph'
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
  const chainId = yield* select(networkSelectors.applicationChainId)
  const queryResult = yield* call<IApolloPoolSnapshotRegistryQueryResult>(
    subgraphClients[chainId].query,
    {
      fetchPolicy: 'no-cache',
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
  yield* call(waitForChainToBeSet)
  const chainId = yield* select(networkSelectors.applicationChainId)
  const queryResult = yield* call<IApolloPoolSnapshotsQueryResult>(
    subgraphClients[chainId].query,
    {
      fetchPolicy: 'no-cache',
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
