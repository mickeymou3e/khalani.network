import { call, put, select } from 'typed-redux-saga'

import { queryPoolSwaps } from '@dataSource/graph/pools/poolsSwaps'
import { PayloadAction } from '@reduxjs/toolkit'

import { poolSwapsSelectors } from './poolSwaps.selector'
import { poolSwapsActions } from './poolSwaps.slice'
import { IBaseOptions, IPoolSwapsPayload } from './poolSwaps.types'

const LIMIT_TRANSACTIONS = 5

export function* poolSwapsActionHandler(
  action: PayloadAction<IPoolSwapsPayload>,
): Generator {
  const { isInitializeFetch, poolId } = action.payload

  const baseOptions: IBaseOptions = {
    poolId,
    userId: null,
    limit: LIMIT_TRANSACTIONS,
  }

  if (isInitializeFetch) {
    try {
      const swaps = yield* call(queryPoolSwaps, {
        ...baseOptions,
        skip: 0,
      })

      const hasMore = swaps.length >= LIMIT_TRANSACTIONS

      yield* put(
        poolSwapsActions.fetchPoolSwapsInitializeSuccess({ hasMore, swaps }),
      )
    } catch {
      yield* put(poolSwapsActions.fetchPoolSwapsInitializeError())
    }
  } else {
    try {
      const swapsAmount = yield* select(poolSwapsSelectors.selectAll)

      const swaps = yield* call(queryPoolSwaps, {
        ...baseOptions,
        skip: swapsAmount.length,
      })

      const hasMore = swaps.length >= LIMIT_TRANSACTIONS

      yield* put(poolSwapsActions.loadMorePoolSwapsSuccess({ hasMore, swaps }))
    } catch {
      yield* put(poolSwapsActions.loadMorePoolSwapsError())
    }
  }
}
