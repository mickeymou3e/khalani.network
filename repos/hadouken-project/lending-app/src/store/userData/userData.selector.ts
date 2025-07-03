import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { calculateHealthFactor } from '@utils/math'

import { selectReducer } from '../store.utils'

const userDataInfo = createSelector(
  selectReducer(StoreKeys.UserData),
  (reducerState) => reducerState,
)

const userHealthFactor = createSelector(
  selectReducer(StoreKeys.UserData),
  (reducerState) =>
    calculateHealthFactor(
      reducerState.totalBorrow,
      reducerState.totalCollateral,
      reducerState.currentLiquidationThreshold,
    ),
)

const userDeposits = createSelector(
  selectReducer(StoreKeys.UserData),
  (reducerState) => reducerState.depositAssets,
)

export const userDataSelector = {
  userDataInfo,
  userHealthFactor,
  userDeposits,
}
