import { IPool } from '@interfaces/pool'
import { createSelector } from '@reduxjs/toolkit'
import { metricsSelectors } from '@store/metrics/metrics.selectors'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { BigDecimal } from '@utils/math'

import { userSharesAdapter } from './userShares.slice'

const selectAllUserPoolsShares = createSelector(
  [selectReducer(StoreKeys.UserShares), walletSelectors.userAddress],
  (userSharesState, userAddress) =>
    userAddress
      ? userSharesAdapter
          .getSelectors()
          .selectById(userSharesState, userAddress)
      : null,
)

const selectUserPoolShare = createSelector(
  [selectAllUserPoolsShares, poolSelectors.selectById],
  (userAllPoolsShares, selectPoolById) => (poolId: IPool['id']) => {
    const pool = selectPoolById(poolId)

    return pool && userAllPoolsShares?.sharesOwned[pool.address]
  },
)

const selectUserPoolSharesUSD = createSelector(
  [
    selectUserPoolShare,
    metricsSelectors.selectPoolTotalValueUSD,
    poolSelectors.selectById,
  ],
  (selectUserPoolShare, selectPoolTotalValueUSD, selectPoolById) => (
    poolId: IPool['id'],
  ) => {
    const pool = selectPoolById(poolId)

    if (pool) {
      const userPoolTotalValue = selectUserPoolShare(pool.id)
      const poolTotalValue = pool.totalShares
      const poolTotalValueUSD = selectPoolTotalValueUSD(pool.id)

      return userPoolTotalValue
        ? userPoolTotalValue.div(poolTotalValue).mul(poolTotalValueUSD)
        : BigDecimal.from(0, 0)
    } else return BigDecimal.from(0, 0)
  },
)

const isFetching = createSelector(
  selectReducer(StoreKeys.UserShares),
  (reducerState) => reducerState.isFetching || !reducerState.initialized,
)

const depositTokenBalances = createSelector(
  [selectReducer(StoreKeys.UserShares)],
  (userSharesState) => userSharesState.depositTokenBalances,
)

export const userSharesSelectors = {
  selectAllUserPoolsShares,
  selectUserPoolShare,
  selectUserPoolSharesUSD,
  isFetching,
  depositTokenBalances,
}
