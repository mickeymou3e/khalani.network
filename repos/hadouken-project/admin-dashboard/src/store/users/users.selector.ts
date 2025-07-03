import { RequestStatus } from '@constants/Request'
import { IUser } from '@graph/users/types'
import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

import { selectReducer } from '../store.utils'
import { usersAdapter } from './users.slice'

const isFetching = createSelector(
  selectReducer(StoreKeys.Users),
  (state) =>
    state.status === RequestStatus.Pending ||
    state.status === RequestStatus.Idle,
)

const selectAll = createSelector(
  selectReducer(StoreKeys.Users),
  usersAdapter.getSelectors().selectAll,
)

const selectById = createSelector(
  selectReducer(StoreKeys.Users),
  (state) => (id?: IUser['id']) =>
    id ? usersAdapter.getSelectors().selectById(state, id) : undefined,
)

export const usersSelectors = {
  selectAll,
  selectById,
  isFetching,
}
