import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

import { selectReducer } from '../store.utils'
import { backstopAdapter } from './backstop.slice'

const selectAll = createSelector(
  selectReducer(StoreKeys.Backstop),
  backstopAdapter.getSelectors().selectAll,
)

const selectById = createSelector(
  selectReducer(StoreKeys.Backstop),
  (state) => (id?: string) =>
    id ? backstopAdapter.getSelectors().selectById(state, id) : undefined,
)

const isFetching = createSelector(
  selectReducer(StoreKeys.Backstop),
  (backstopState) => backstopState.isFetching,
)

export const backstopSelectors = {
  selectAll,
  selectById,
  isFetching,
}
