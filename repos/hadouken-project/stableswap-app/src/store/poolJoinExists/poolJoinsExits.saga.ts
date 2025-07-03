import { call, put, select } from 'typed-redux-saga'

import { LiquidityToggle } from '@containers/pools/PoolLiquidity/PoolLiquidity.types'
import { queryPoolJoinsExits } from '@dataSource/graph/pools/poolLiquidity'
import { LiquidityProvisionType } from '@dataSource/graph/pools/poolLiquidity/types'
import { PayloadAction } from '@reduxjs/toolkit'

import { poolJoinsExitsSelectors } from './poolJoinsExits.selector'
import { poolJoinsExitsActions } from './poolJoinsExits.slice'
import { IPoolJoinsExitsPayload } from './poolJoinsExits.types'

const LIMIT_TRANSACTIONS = 5

const checkHasMore = (amount: number) => amount >= LIMIT_TRANSACTIONS

export function* fetchPoolJoinsExits(
  action: PayloadAction<IPoolJoinsExitsPayload>,
): Generator {
  const { userId, poolId, liquidityToggle } = action.payload

  const selectAllTransactionsByToggle = yield* select(
    poolJoinsExitsSelectors.selectAll,
  )

  if (!liquidityToggle) {
    try {
      const myLiquidity = userId
        ? yield* call(queryPoolJoinsExits, {
            poolId,
            userId,
            skip: { joins: 0, exits: 0 },
            limit: LIMIT_TRANSACTIONS,
          })
        : []

      const allLiquidity = yield* call(queryPoolJoinsExits, {
        poolId,
        userId: null,
        skip: { joins: 0, exits: 0 },
        limit: LIMIT_TRANSACTIONS,
      })

      const hasMore = {
        allLiquidity: checkHasMore(allLiquidity.length),
        myLiquidity: checkHasMore(myLiquidity.length),
      }

      yield* put(
        poolJoinsExitsActions.fetchPoolJoinsExitsInitializeSuccess({
          allLiquidity,
          myLiquidity,
          hasMore,
        }),
      )
    } catch {
      yield* put(poolJoinsExitsActions.fetchPoolJoinsExitsInitializeError())
    }

    return
  }

  const liquidityTransactions = selectAllTransactionsByToggle(liquidityToggle)

  const skip = liquidityTransactions.reduce<{
    joins: number
    exits: number
  }>(
    (skip, transaction) => {
      if (transaction.type === LiquidityProvisionType.Exit) {
        skip.exits += 1
      } else {
        skip.joins += 1
      }

      return skip
    },
    { joins: 0, exits: 0 },
  )

  try {
    if (liquidityToggle === LiquidityToggle.MyLiquidity && userId) {
      const myLiquidity = yield* call(queryPoolJoinsExits, {
        poolId,
        userId,
        skip,
        limit: LIMIT_TRANSACTIONS,
      })

      const hasMore = {
        myLiquidity: checkHasMore(myLiquidity.length),
      }

      yield* put(
        poolJoinsExitsActions.loadMorePoolJoinExitsSuccess({
          myLiquidity,
          allLiquidity: [],
          hasMore,
        }),
      )
    }

    if (liquidityToggle === LiquidityToggle.AllLiquidity) {
      const allLiquidity = yield* call(queryPoolJoinsExits, {
        poolId,
        userId: null,
        skip,
        limit: LIMIT_TRANSACTIONS,
      })

      const hasMore = {
        allLiquidity: checkHasMore(allLiquidity.length),
      }

      yield* put(
        poolJoinsExitsActions.loadMorePoolJoinExitsSuccess({
          myLiquidity: [],
          allLiquidity,
          hasMore,
        }),
      )
    }
  } catch {
    yield* put(poolJoinsExitsActions.loadMoreJoinExitsError())
  }
}
