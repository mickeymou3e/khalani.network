import { StrictEffect } from 'redux-saga/effects'
import { call, select, put } from 'typed-redux-saga/'

import { LIQUIDATIONS_LIMIT } from '@pages/Backstop/Backstop.constants'
import { PayloadAction } from '@reduxjs/toolkit'
import { backstopActions } from '@store/backstop/backstop.slice'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { subgraphClients } from '@utils/network/subgraph'
import { Subgraph } from '@utils/network/subgraph.types'

import { mapLiquidationQuery } from './mapper'
import { LIQUIDATIONS_QUERY } from './queries'
import {
  IApolloLiquidationQueryResult,
  ILiquidationsQueryResultData,
  Liquidation,
} from './types'

export function* queryLiquidations({
  chainId,
  blockNumber,
  limit,
  skip,
}: {
  chainId: string
  limit: number | null
  skip: number
  blockNumber?: number
}): Generator<StrictEffect, ILiquidationsQueryResultData> {
  const poolsQueryResult = yield* call<IApolloLiquidationQueryResult>(
    subgraphClients[chainId].query,
    {
      fetchPolicy: 'no-cache',
      context: {
        type: Subgraph.Balancer,
      },
      query: LIQUIDATIONS_QUERY,
      variables: {
        ...(blockNumber
          ? {
              block: {
                number: blockNumber,
              },
              limit,
              skip,
            }
          : {
              limit,
              skip,
            }),
      },
    },
  )

  return poolsQueryResult.data
}

export function* fetchLiquidations(
  chainId: string,
  limit: number | null,
  skip: number,
  blockNumber?: number,
): Generator<StrictEffect, Liquidation[]> {
  const liquidationsQueryResultData = yield* call(queryLiquidations, {
    blockNumber: blockNumber,
    chainId: chainId,
    limit,
    skip,
  })

  const allTokens = yield* select(tokenSelectors.selectAllTokens)

  const liquidations = mapLiquidationQuery(
    liquidationsQueryResultData.liquidations,
    allTokens,
  )

  return liquidations
}

export function* fetchMoreLiquidations(
  action: PayloadAction<{
    chainId: string
    limit: number
    skip: number
  }>,
): Generator {
  const { chainId, limit, skip } = action.payload

  try {
    const liquidations = yield* call(fetchLiquidations, chainId, limit, skip)

    const hasMore = liquidations.length >= LIQUIDATIONS_LIMIT

    yield* put(
      backstopActions.loadMoreLiquidationsSuccess({ liquidations, hasMore }),
    )
  } catch {
    yield* put(backstopActions.loadMoreLiquidationsFailure())
  }
}
