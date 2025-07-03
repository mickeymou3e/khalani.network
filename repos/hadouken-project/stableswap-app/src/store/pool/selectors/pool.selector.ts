import { RequestStatus } from '@constants/Request'
import { IPool } from '@interfaces/pool'
import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

import { selectReducer } from '../../store.utils'
import { poolsAdapter } from '../pool.slice'

const poolsReady = createSelector(
  selectReducer(StoreKeys.Pools),
  (reducerState) =>
    reducerState.status === RequestStatus.Resolved ||
    reducerState.status === RequestStatus.Rejected,
)

const isFetching = createSelector(
  poolsReady,
  selectReducer(StoreKeys.Pools),
  (isReady, reducerState) => !isReady || reducerState.isFetching,
)

const selectAll = createSelector(
  selectReducer(StoreKeys.Pools),
  poolsAdapter.getSelectors().selectAll,
)

const pools = createSelector(selectReducer(StoreKeys.Pools), (state) =>
  poolsAdapter.getSelectors().selectAll(state),
)

const selectById = createSelector(
  selectReducer(StoreKeys.Pools),
  (state) => (id: IPool['id']) =>
    poolsAdapter.getSelectors().selectById(state, id),
)

const selectByAddress = createSelector(
  selectAll,
  (pools) => (poolAddress: IPool['address']) =>
    pools.find(({ address }) => address === poolAddress),
)

const selectManyByIds = createSelector(
  selectReducer(StoreKeys.Pools),
  (state) => (ids: IPool['id'][]) =>
    poolsAdapter
      .getSelectors()
      .selectAll(state)
      .filter(({ id }) => ids.includes(id)),
)

const selectByName = createSelector(
  selectReducer(StoreKeys.Pools),
  (state) => (name: IPool['name']) =>
    poolsAdapter
      .getSelectors()
      .selectAll(state)
      .find((pool) => pool.name === name),
)

export const poolSelectors = {
  pools,
  isFetching,
  poolsReady,
  selectAll,
  selectById,
  selectByAddress,
  selectManyByIds,
  selectByName,
}
