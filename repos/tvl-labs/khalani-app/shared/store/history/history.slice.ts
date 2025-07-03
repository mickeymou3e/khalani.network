import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { ETransactionStatus } from '@tvl-labs/khalani-ui'
import { RequestStatus } from '@tvl-labs/sdk'

import { StoreKeys } from '../store.keys'
import {
  IHistorySagaState,
  ITransaction,
  OperationStatus,
} from './history.types'

export const historyAdapter = createEntityAdapter<ITransaction>()

export const initHistorySliceState = historyAdapter.getInitialState<IHistorySagaState>(
  {
    pendingQueue: [],
    lastTx: null,
    status: RequestStatus.Idle,
  },
)

export const HistorySlice = createSlice({
  initialState: initHistorySliceState,
  name: StoreKeys.History,
  reducers: {
    initializeSaga: (state) => state,
    addTransaction: (state, action: PayloadAction<Required<ITransaction>>) => {
      historyAdapter.addOne(state, action.payload)
    },
    setOperationPending: (
      state,
      action: PayloadAction<
        Required<{
          transactionId: string
        }>
      >,
    ) => {
      const transaction = historyAdapter
        .getSelectors()
        .selectById(state, action.payload.transactionId)

      if (!transaction) {
        console.warn('transaction not found', action.payload.transactionId)
        return state
      }

      const firstWaitingOperation = transaction.operations.find(
        (operation) => operation.status === OperationStatus.Waiting,
      )

      if (!firstWaitingOperation) {
        console.warn(
          'There are no waiting operations for transaction',
          action.payload.transactionId,
        )
        return state
      }

      const operations = transaction.operations.map((operation) => {
        return {
          ...operation,
          status:
            operation.id === firstWaitingOperation.id
              ? OperationStatus.Pending
              : operation.status,
        }
      })

      state.pendingQueue.push(firstWaitingOperation.id)

      historyAdapter.updateOne(state, {
        id: action.payload.transactionId,
        changes: {
          operations: operations,
        },
      })

      return state
    },
    setOperationSuccess: (
      state,
      action: PayloadAction<
        Required<{
          transactionId: string
        }>
      >,
    ) => {
      const transaction = historyAdapter
        .getSelectors()
        .selectById(state, action.payload.transactionId)

      if (!transaction) {
        console.warn('transaction not found', action.payload.transactionId)
        return state
      }

      const currentOnGoingOperation = transaction.operations.find(
        (operation) => operation.status === OperationStatus.Pending,
      )

      if (!currentOnGoingOperation) {
        console.warn(
          'there are no ongoing operations for transaction',
          action.payload.transactionId,
        )
        return state
      }

      const operations = transaction.operations.map((operation) => {
        return {
          ...operation,
          status:
            operation.id === currentOnGoingOperation.id
              ? OperationStatus.Success
              : operation.status,
        }
      })

      state.pendingQueue = state.pendingQueue.filter(
        (operationId) => operationId !== currentOnGoingOperation.id,
      )

      const actionDone = operations.every(
        (operation) =>
          operation.status !== OperationStatus.Pending &&
          operation.status !== OperationStatus.Waiting,
      )

      const actionSuccess = operations.every(
        (x) => x.status === OperationStatus.Success,
      )

      const transactionResult = actionSuccess
        ? ETransactionStatus.Success
        : ETransactionStatus.Fail

      const actionStatus = actionDone ? transactionResult : transaction.status

      historyAdapter.updateOne(state, {
        id: action.payload.transactionId,
        changes: {
          operations: operations,
          status: actionStatus,
        },
      })

      return state
    },
    setOperationFailure: (
      state,
      action: PayloadAction<
        Required<{
          transactionId: string
        }>
      >,
    ) => {
      const transaction = historyAdapter
        .getSelectors()
        .selectById(state, action.payload.transactionId)

      if (!transaction) {
        console.warn('transaction not found', action.payload.transactionId)
        return state
      }

      const currentOnGoingOperation = transaction.operations.find(
        (operation) => operation.status === OperationStatus.Pending,
      )

      const operations = transaction.operations.map((operation) => {
        let status = operation.status
        if (operation.id === currentOnGoingOperation?.id) {
          status = OperationStatus.Fail
        } else if (operation.status === OperationStatus.Waiting) {
          status = OperationStatus.Aborted
        }
        return { ...operation, status }
      })

      state.pendingQueue = state.pendingQueue.filter(
        (operationId) => operationId !== currentOnGoingOperation?.id,
      )

      historyAdapter.updateOne(state, {
        id: action.payload.transactionId,
        changes: {
          operations: operations,
          status: ETransactionStatus.Fail,
        },
      })

      return state
    },
    closeUnfinishedTransactions: (state) => {
      const ids = state.ids
      ids.forEach((id) => {
        if (
          state?.entities?.[id] &&
          (state.entities[id] as ITransaction).status ===
            ETransactionStatus.Pending
        )
          (state.entities[id] as ITransaction).status = ETransactionStatus.Fail

        state?.entities[id]?.operations.forEach((operation) => {
          if (
            operation.status === OperationStatus.Waiting ||
            operation.status === OperationStatus.Pending
          ) {
            operation.status = OperationStatus.Aborted
          }
        })
      })
      return state
    },
    clearTransactions: (state) => {
      state.pendingQueue = []
      state.ids = []
      state.entities = {}
      return state
    },
    setLastTx: (state, action: PayloadAction<Required<string | null>>) => {
      state.lastTx = action.payload
      return state
    },
  },
})

export const historyActions = HistorySlice.actions
export const historyReducer = HistorySlice.reducer
