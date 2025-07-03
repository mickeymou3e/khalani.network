import { createSelector } from '@reduxjs/toolkit'
import { pricesAdapter } from '@store/prices/prices.slice'
import { StoreKeys } from '@store/store.keys'

import { Id } from './prices.types'
import { selectReducer } from '@store/store.utils'

const selectAll = createSelector(
  [selectReducer(StoreKeys.Prices)],
  (pricesState) => pricesAdapter.getSelectors().selectAll(pricesState),
)

const selectById = createSelector(
  [selectReducer(StoreKeys.Prices)],
  (pricesState) => (id: Id) =>
    pricesAdapter.getSelectors().selectById(pricesState, id),
)

const selectManyByIds = createSelector(
  [selectReducer(StoreKeys.Prices)],
  (pricesState) => (ids: Id[]) => {
    const prices = pricesAdapter.getSelectors().selectAll(pricesState)

    return ids.map((id) => prices.find(({ id: priceId }) => id === priceId))
  },
)

export const pricesSelector = {
  selectAll,
  selectById,
  selectManyByIds,
}
