import { memoize } from 'lodash'

import { RequestStatus } from '@constants/Request'
import { IReserve } from '@interfaces/tokens'
import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { sortTokensByAddressOrder } from '@utils/token'

import { selectReducer } from '../store.utils'
import { reservesAdapter } from './reserves.slice'

const isFetching = createSelector(
  selectReducer(StoreKeys.Reserves),
  (state) =>
    state.status === RequestStatus.Pending ||
    state.status === RequestStatus.Idle,
)

const selectAll = createSelector(
  selectReducer(StoreKeys.Reserves),
  reservesAdapter.getSelectors().selectAll,
)

const selectMany = createSelector(selectReducer(StoreKeys.Reserves), (state) =>
  memoize((ids: string[]) =>
    reservesAdapter
      .getSelectors()
      .selectAll(state)
      .filter((token) => ids.includes(token.id))
      .sort(sortTokensByAddressOrder(ids)),
  ),
)

const selectById = createSelector(
  selectReducer(StoreKeys.Reserves),
  (state) => (id?: IReserve['id']) =>
    id ? reservesAdapter.getSelectors().selectById(state, id) : undefined,
)

export const reservesSelectors = {
  selectAll,
  selectMany,
  selectById,
  isFetching,
}
