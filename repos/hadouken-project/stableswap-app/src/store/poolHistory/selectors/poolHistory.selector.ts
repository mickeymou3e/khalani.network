import { RequestStatus } from '@constants/Request'
import { IPool } from '@interfaces/pool'
import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

import { selectReducer } from '../../store.utils'
import { poolsHistoryAdapter } from '../poolHistory.slice'

const poolsHistoryReady = createSelector(
  selectReducer(StoreKeys.PoolsHistory),
  (reducerState) =>
    reducerState.status === RequestStatus.Resolved ||
    reducerState.status === RequestStatus.Rejected,
)

const selectAll = createSelector(
  selectReducer(StoreKeys.PoolsHistory),
  (state) => poolsHistoryAdapter.getSelectors().selectAll(state),
)

const selectById = createSelector(
  selectReducer(StoreKeys.PoolsHistory),
  (state) => (id: IPool['id']) =>
    poolsHistoryAdapter.getSelectors().selectById(state, id),
)

const selectManyByIds = createSelector(
  selectReducer(StoreKeys.PoolsHistory),
  (state) => (ids: IPool['id'][]) =>
    poolsHistoryAdapter
      .getSelectors()
      .selectAll(state)
      .filter(({ id }) => ids.includes(id)),
)

export const poolHistorySelectors = {
  poolsHistoryReady,
  selectAll,
  selectById,
  selectManyByIds,
}
