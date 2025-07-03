import { RequestStatus } from '@constants/Request'
import { IPool } from '@interfaces/pool'
import { createSelector } from '@reduxjs/toolkit'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'
import { walletSelectors } from '@store/wallet/wallet.selector'

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

const isFetching = createSelector(
  selectReducer(StoreKeys.UserShares),
  (reducerState) => reducerState.status === RequestStatus.Pending,
)

export const userSharesSelectors = {
  selectAllUserPoolsShares,
  selectUserPoolShare,
  isFetching,
}
