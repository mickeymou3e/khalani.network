import { RequestStatus } from '@constants/Request'
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

import {
  TransactionHistory,
  ITransactionHistorySagaState,
} from './transactionHistory.types'

export const transactionHistoryAdapter =
  createEntityAdapter<TransactionHistory>()

const initTransactionHistorySliceState =
  transactionHistoryAdapter.getInitialState<ITransactionHistorySagaState>({
    status: RequestStatus.Idle,
    isFetching: false,
  })

export const TransactionHistorySlice = createSlice({
  initialState: initTransactionHistorySliceState,
  name: StoreKeys.TransactionHistory,
  reducers: {
    updateTransactionHistoryRequest: (state) => ({
      ...state,
      isFetching: true,
    }),
    updateTransactionHistorySuccess: (state) => ({
      ...state,
      isFetching: false,
      status: RequestStatus.Resolved,
    }),
    updateTransactionHistoryFailure: (state) => ({
      ...state,
      isFetching: false,
      status: RequestStatus.Rejected,
    }),
    updateTransactionHistory: (
      state,
      action: PayloadAction<TransactionHistory[]>,
    ) => {
      const transactions = action.payload
      transactionHistoryAdapter.removeAll(state)
      transactionHistoryAdapter.upsertMany(state, transactions)
    },
  },
})

export const transactionHistoryActions = TransactionHistorySlice.actions
export const transactionHistoryReducer = TransactionHistorySlice.reducer
