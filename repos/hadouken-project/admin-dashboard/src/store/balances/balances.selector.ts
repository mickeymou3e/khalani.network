import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

import { selectReducer } from '../store.utils'
import { balancesAdapter } from './balances.slice'

const selectAll = createSelector(
  selectReducer(StoreKeys.Balances),
  balancesAdapter.getSelectors().selectAll,
)

export const balancesSelectors = {
  selectAll,
}
