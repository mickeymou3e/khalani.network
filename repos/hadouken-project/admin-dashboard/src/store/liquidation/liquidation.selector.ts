import { RequestStatus } from '@constants/Request'
import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

import { selectReducer } from '../store.utils'
import { liquidationAdapter } from './liquidation.slice'

const isFetching = createSelector(
  selectReducer(StoreKeys.Liquidation),
  (state) =>
    state.status === RequestStatus.Pending ||
    state.status === RequestStatus.Idle,
)

const selectAll = createSelector(
  selectReducer(StoreKeys.Liquidation),
  liquidationAdapter.getSelectors().selectAll,
)

export const liquidationSelectors = {
  selectAll,
  isFetching,
}
