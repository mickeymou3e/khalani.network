import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

import { transactionHistoryAdapter } from './transactionHistory.slice'

const selectById = createSelector(
  [selectReducer(StoreKeys.TransactionHistory)],
  (state) => (id: string) =>
    transactionHistoryAdapter.getSelectors().selectById(state, id),
)

const selectAll = createSelector(
  [selectReducer(StoreKeys.TransactionHistory)],
  (state) => transactionHistoryAdapter.getSelectors().selectAll(state),
)

export const transactionHistorySelectors = {
  selectById,
  selectAll,
}
