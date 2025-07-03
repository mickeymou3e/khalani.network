import { RequestStatus } from '@constants/Request'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { DepositRecord } from '@services/deposit'

export interface DepositHistoryState {
  status: RequestStatus
  isFetching: boolean
  isInitialized: boolean
  history: DepositRecord[] | null
}

const initialState: DepositHistoryState = {
  status: RequestStatus.Idle,
  isFetching: false,
  isInitialized: false,
  history: null,
}

export const DepositHistorySlice = createSlice({
  name: StoreKeys.DepositHistory,
  initialState,
  reducers: {
    request: (state) => ({ ...state, isFetching: true }),
    requestSuccess: (state, action: PayloadAction<DepositRecord[]>) => ({
      ...state,
      isFetching: false,
      isInitialized: true,
      status: RequestStatus.Resolved,
      history: action.payload,
    }),
    requestError: (state, action: PayloadAction<string>) => ({
      ...state,
      isFetching: false,
      isInitialized: true,
      status: RequestStatus.Rejected,
      history: null,
      error: action.payload,
    }),
  },
})

export const depositHistoryActions = DepositHistorySlice.actions
export const depositHistoryReducer = DepositHistorySlice.reducer
