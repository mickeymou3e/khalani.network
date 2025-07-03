import _ from 'lodash'

import { ByKey, reduceByKey } from '@dataSource/graph/pools/pools/mapper'
import { createSelector } from '@reduxjs/toolkit'
import { pricesAdapter } from '@store/prices/prices.slice'
import { IPrice } from '@store/prices/prices.types'
import { StoreKeys } from '@store/store.keys'

import { selectReducer } from '../store.utils'

const selectAll = createSelector(
  selectReducer(StoreKeys.Prices),
  (pricesState) => pricesAdapter.getSelectors().selectAll(pricesState),
)

const selectById = createSelector(
  selectReducer(StoreKeys.Prices),
  (pricesState) => (id: string) =>
    pricesAdapter.getSelectors().selectById(pricesState, id),
)

const selectManyByIdsDEPRECATED = createSelector(
  selectReducer(StoreKeys.Prices),
  // TODO: problem with Id replication. Currently most of balance like store keys are indexed by token id/address how to unify it, to make it obvious?
  (pricesState) => (ids: string[]) => {
    const prices = pricesAdapter.getSelectors().selectAll(pricesState)

    return ids
      .map((id) => prices.find(({ id: priceId }) => id === priceId))
      .filter((id) => id !== undefined)
  },
)

const selectManyByIds = createSelector(
  selectReducer(StoreKeys.Prices),
  // TODO: problem with Id replication. Currently most of balance like store keys are indexed by token id/address how to unify it, to make it obvious?
  (pricesState) => (ids: string[]) => {
    const prices = pricesAdapter.getSelectors().selectAll(pricesState)

    return _.pickBy(
      prices?.reduce(
        reduceByKey<IPrice, 'id'>('id'),
        {} as ByKey<IPrice, 'id'>,
      ),
      (price, id) => ids?.includes(id),
    )
  },
)

export const pricesSelector = {
  selectAll,
  selectById,
  selectManyByIds: selectManyByIdsDEPRECATED,
  selectManyByIdsNEW: selectManyByIds,
}
