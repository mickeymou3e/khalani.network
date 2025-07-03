import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'
import { TokenModelBalanceWithChain } from '@store/tokens/tokens.types'

import { mTokenBalancesAdapter } from './balances.slice'

const selectById = createSelector(
  [selectReducer(StoreKeys.MTokenBalances)],
  (state) => (id: TokenModelBalanceWithChain['id']) =>
    mTokenBalancesAdapter.getSelectors().selectById(state, id),
)

const selectAll = createSelector(
  [selectReducer(StoreKeys.MTokenBalances)],
  (state) => mTokenBalancesAdapter.getSelectors().selectAll(state),
)

const isInitialized = createSelector(
  [selectReducer(StoreKeys.MTokenBalances)],
  (state) => state.isInitialized,
)

export const mTokenBalancesSelectors = {
  selectById,
  selectAll,
  isInitialized,
}
