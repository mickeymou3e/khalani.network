import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'
import { TokenModelBalanceWithChain } from '@store/tokens/tokens.types'

import { balancesAdapter } from './balances.slice'

const selectById = createSelector(
  [selectReducer(StoreKeys.Balances)],
  (state) => (id: TokenModelBalanceWithChain['id']) =>
    balancesAdapter.getSelectors().selectById(state, id),
)

const selectAll = createSelector([selectReducer(StoreKeys.Balances)], (state) =>
  balancesAdapter.getSelectors().selectAll(state),
)

export const balancesSelectors = {
  selectById,
  selectAll,
}
