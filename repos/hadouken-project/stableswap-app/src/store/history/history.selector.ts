import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

import { historyAdapter } from './history.slice'
import { OperationStatus, TransactionStatus } from './history.types'

const selectAll = createSelector(
  selectReducer(StoreKeys.History),
  historyAdapter.getSelectors().selectAll,
)

const currentPendingTransaction = createSelector(
  selectReducer(StoreKeys.History),
  (state) =>
    historyAdapter
      .getSelectors()
      .selectAll(state)
      .find((transaction) => transaction.status === TransactionStatus.Pending),
)

const currentPendingTransactionOrLastTransaction = createSelector(
  selectReducer(StoreKeys.History),
  (state) => {
    const transaction = historyAdapter.getSelectors().selectAll(state)

    return (
      transaction.find(
        (transaction) => transaction.status === TransactionStatus.Pending,
      ) || transaction.slice(-1)[0]
    )
  },
)

const currentPendingOperation = createSelector(
  currentPendingTransaction,
  (pendingTransaction) =>
    pendingTransaction?.operations?.find(
      (operation) => operation.status === OperationStatus.Pending,
    ),
)

const operationsInProgressCount = createSelector(
  selectReducer(StoreKeys.History),
  (state) => {
    const allPendingTransactions = historyAdapter
      .getSelectors()
      .selectAll(state)
      .filter((transaction) => transaction.status === TransactionStatus.Pending)

    const allPendingOperations = allPendingTransactions.reduce(
      (allPendingOperations, transaction) => {
        const pendingOperations = transaction.operations.filter(
          (operation) =>
            operation.status === OperationStatus.Pending ||
            operation.status === OperationStatus.Waiting,
        ).length
        return allPendingOperations + pendingOperations
      },
      0,
    )
    return allPendingOperations
  },
)

const inProgress = createSelector(
  selectReducer(StoreKeys.History),
  (state) =>
    historyAdapter
      .getSelectors()
      .selectAll(state)
      .filter((transaction) =>
        transaction.operations.some(
          (operation) =>
            operation.status === OperationStatus.Pending ||
            operation.status === OperationStatus.Waiting,
        ),
      ).length > 0,
)

const showBadge = createSelector(
  selectReducer(StoreKeys.History),
  (state) => state.showBadge,
)

const historyDropdown = createSelector(
  selectReducer(StoreKeys.History),
  (state) => state.showHistoryDropdown,
)

const lastSubgraphSyncedBlock = createSelector(
  selectReducer(StoreKeys.History),
  (state) => state.lastSubgraphSyncedBlock,
)

export const historySelector = {
  selectAll,
  inProgress,
  showBadge,
  historyDropdown,
  currentPendingTransaction,
  currentPendingTransactionOrLastTransaction,
  currentPendingOperation,
  operationsInProgressCount,
  lastSubgraphSyncedBlock,
}
