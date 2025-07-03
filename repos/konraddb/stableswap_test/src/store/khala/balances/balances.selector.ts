import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

import { ITokenModelBalanceWithChain } from '../tokens/tokens.types'
import { khalaBalancesAdapter } from './balances.slice'

const selectById = createSelector(
  selectReducer(StoreKeys.KhalaBalances),
  (state) => (id: ITokenModelBalanceWithChain['id']) =>
    khalaBalancesAdapter.getSelectors().selectById(state, id),
)

const selectAll = createSelector(
  selectReducer(StoreKeys.KhalaBalances),
  (state) => khalaBalancesAdapter.getSelectors().selectAll(state),
)

const onlyChainIdWithTokens = createSelector(
  selectReducer(StoreKeys.KhalaBalances),
  (reducerState) => reducerState.onlyChainIdWithTokens,
)

export const khalaBalancesSelectors = {
  selectById,
  selectAll,
  onlyChainIdWithTokens,
}
