import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'
import { ETransactionStatus } from '@tvl-labs/khalani-ui'

import { historyAdapter } from './history.slice'
import {
  checkIfIsInProgress,
  findPendingOrLastTransaction,
  getPendingOperations,
} from './history.utils'

const selectAll = createSelector(
  selectReducer(StoreKeys.History),
  historyAdapter.getSelectors().selectAll,
)

const lastTx = createSelector(
  [selectReducer(StoreKeys.History)],
  (state) => state.lastTx,
)

const currentPendingTransactionOrLastTransaction = createSelector(
  [selectReducer(StoreKeys.History)],
  (state) => {
    const transactions = historyAdapter.getSelectors().selectAll(state)

    return findPendingOrLastTransaction(transactions)
  },
)

const operationsInProgressCount = createSelector(
  [selectReducer(StoreKeys.History)],
  (state) => {
    const allPendingTransactions = historyAdapter
      .getSelectors()
      .selectAll(state)
      .filter(
        (transaction) => transaction.status === ETransactionStatus.Pending,
      )

    const allPendingOperations = getPendingOperations(allPendingTransactions)

    return allPendingOperations
  },
)

const inProgress = createSelector(
  [selectReducer(StoreKeys.History)],
  (state) => {
    const transactions = historyAdapter.getSelectors().selectAll(state)

    return checkIfIsInProgress(transactions)
  },
)

export const historySelector = {
  lastTx,
  selectAll,
  inProgress,
  currentPendingTransactionOrLastTransaction,
  operationsInProgressCount,
}
