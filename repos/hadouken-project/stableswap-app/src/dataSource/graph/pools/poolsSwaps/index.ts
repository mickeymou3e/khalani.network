import { StrictEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { waitForPoolsAndTokensBeFetched } from '@store/deposit/saga/editor/utils'
import { networkSelectors } from '@store/network/network.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { waitForChainToBeSet } from '@store/wallet/metamask/metaMaskObserver/metaMaskObserver.event'
import { subgraphClients } from '@utils/network/subgraph'
import { Subgraph } from '@utils/network/subgraph.types'

import { POOL_SWAPS_QUERY } from './queries'
import { IApolloPoolSwapsQuery, IQueryPoolSwaps, ISwap } from './types'

export function* queryPoolSwaps({
  poolId,
  userId,
  limit,
  skip,
}: IQueryPoolSwaps): Generator<StrictEffect, ISwap[]> {
  yield* call(waitForChainToBeSet)
  yield* call(waitForPoolsAndTokensBeFetched)

  const selectPoolModel = yield* select(poolsModelsSelector.selectById)

  const poolModel = selectPoolModel(poolId)

  if (!poolModel) return []

  const chainId = yield* select(networkSelectors.applicationChainId)
  const poolSwaps = yield* call<IApolloPoolSwapsQuery>(
    subgraphClients[chainId].query,
    {
      fetchPolicy: 'no-cache',
      context: {
        type: Subgraph.Balancer,
      },
      query: POOL_SWAPS_QUERY,
      variables: {
        where: {
          ...(userId
            ? {
                poolId,
                userAddress: userId,
                tokenIn_not: poolModel.address,
                tokenOut_not: poolModel.address,
              }
            : {
                poolId,
                tokenIn_not: poolModel.address,
                tokenOut_not: poolModel.address,
              }),
        },
        limit,
        skip,
      },
    },
  )

  return poolSwaps.data.swaps
}
