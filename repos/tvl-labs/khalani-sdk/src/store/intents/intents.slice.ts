import { RequestStatus } from '@constants/Request'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { IntentHistory } from './intents.types'

export interface IntentsState {
  status: RequestStatus
  isFetching: boolean
  isInitialized: boolean
  history: IntentHistory[] | null
}

const initialState: IntentsState = {
  status: RequestStatus.Idle,
  isFetching: false,
  isInitialized: false,
  history: null,
}

export const IntentsSlice = createSlice({
  name: StoreKeys.Intents,
  initialState,
  reducers: {
    request: (state) => ({ ...state, isFetching: true }),
    requestSuccess: (state, action: PayloadAction<IntentHistory[]>) => ({
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

export const intentsActions = IntentsSlice.actions
export const intentsReducer = IntentsSlice.reducer
