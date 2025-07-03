import { RequestStatus } from '@constants/Request'
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import {
  IHistorySagaState,
  ITransaction,
  OperationStatus,
  TransactionStatus,
} from './history.types'

export const historyAdapter = createEntityAdapter<ITransaction>()

export const initHistorySliceState = historyAdapter.getInitialState<IHistorySagaState>(
  {
    pendingQueue: [],
    status: RequestStatus.Idle,
    lastSubgraphSyncedBlock: 0,
    showBadge: false,
    showHistoryDropdown: false,
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
    updateTransactionOperations: (
      state,
      action: PayloadAction<
        Required<{ id: string; operations: ITransaction['operations'] }>
      >,
    ) => {
      historyAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          operations: action.payload.operations,
        },
      })
    },
    setOperationPending: (
      state,
      action: PayloadAction<
        Required<{
          transactionId: string
          operationId: string
        }>
      >,
    ) => {
      const { operationId, transactionId } = action.payload

      const transaction = historyAdapter
        .getSelectors()
        .selectById(state, transactionId)

      if (!transaction) {
        return state
      }

      const operation = transaction.operations.find(
        (operation) =>
          operation.id === operationId &&
          operation.status === OperationStatus.Waiting,
      )

      if (!operation) {
        return state
      }

      const operations = transaction.operations.map((operation) => {
        return {
          ...operation,
          status:
            operationId === operation.id
              ? OperationStatus.Pending
              : operation.status,
        }
      })

      state.pendingQueue.push(operation.id)

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
          operationId: string
        }>
      >,
    ) => {
      const { operationId, transactionId } = action.payload

      const transaction = historyAdapter
        .getSelectors()
        .selectById(state, transactionId)

      if (!transaction) {
        return state
      }

      const ongoingOperation = transaction.operations.find(
        (operation) =>
          operation.id === operationId &&
          operation.status === OperationStatus.Pending,
      )

      if (!ongoingOperation) {
        return state
      }

      const operations = transaction.operations.map((operation) => {
        return {
          ...operation,
          status:
            operation.id === ongoingOperation.id
              ? OperationStatus.Success
              : operation.status,
        }
      })

      state.pendingQueue = state.pendingQueue.filter(
        (operationId) => operationId !== ongoingOperation.id,
      )

      const actionDone = operations.every(
        (operation) =>
          operation.status !== OperationStatus.Pending &&
          operation.status !== OperationStatus.Waiting,
      )

      const actionSuccess = operations.every(
        (operation) => operation.status === OperationStatus.Success,
      )

      const transactionResult = actionSuccess
        ? TransactionStatus.Success
        : TransactionStatus.Fail

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
      const { transactionId } = action.payload
      const transaction = historyAdapter
        .getSelectors()
        .selectById(state, transactionId)

      if (!transaction) {
        return state
      }

      const operations = transaction.operations.map((operation) => {
        let status = operation.status
        if (status === OperationStatus.Pending) {
          status = OperationStatus.Fail
        } else if (operation.status === OperationStatus.Waiting) {
          status = OperationStatus.Aborted
        }
        return { ...operation, status }
      })

      state.pendingQueue = []

      historyAdapter.updateOne(state, {
        id: action.payload.transactionId,
        changes: {
          operations: operations,
          status: TransactionStatus.Fail,
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
            TransactionStatus.Pending
        )
          (state.entities[id] as ITransaction).status = TransactionStatus.Fail

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
    clearOldTransactions: (state) => {
      historyAdapter.removeMany(
        state,
        state.ids.length > 0 ? state.ids.slice(0, state.ids.length - 1) : [],
      )

      const firstWaitingOperation = historyAdapter
        .getSelectors()
        .selectAll(state)
        .find((x) =>
          x.operations.find((y) => y.status === OperationStatus.Pending),
        )

      state.pendingQueue = firstWaitingOperation
        ? [firstWaitingOperation.id]
        : []

      return state
    },
    setSubgraphBlock: (state, action: PayloadAction<Required<number>>) => {
      state.lastSubgraphSyncedBlock = action.payload
      return state
    },
    toggleBadge: (state, action: PayloadAction<boolean>) => {
      state.showBadge = action.payload

      return state
    },
    toggleHistoryDropdown: (state, action: PayloadAction<boolean>) => {
      state.showHistoryDropdown = action.payload

      return state
    },
  },
})

export const historyActions = HistorySlice.actions
export const historyReducer = HistorySlice.reducer
