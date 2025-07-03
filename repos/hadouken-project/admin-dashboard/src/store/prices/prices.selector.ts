import { BigNumber } from 'ethers'

import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

import { selectReducer } from '../store.utils'
import { IPrice, pricesAdapter } from './prices.slice'

const selectAll = createSelector(
  selectReducer(StoreKeys.Prices),
  pricesAdapter.getSelectors().selectAll,
)

const DEFAULT_PRICE = {
  id: '',
  price: BigNumber.from(0),
}

const selectById = createSelector(
  selectReducer(StoreKeys.Prices),
  (state) => (id?: IPrice['id']) =>
    id
      ? pricesAdapter.getSelectors().selectById(state, id) || DEFAULT_PRICE
      : DEFAULT_PRICE,
)

export const pricesSelectors = {
  selectAll,
  selectById,
}
