import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { QueryRefineParams, QueryRefineResult } from './query.types'

export interface QueryRefineState {
  loading: boolean
  error: string | null
  input: QueryRefineParams | null
  output: QueryRefineResult | null
}

const initialState: QueryRefineState = {
  loading: false,
  error: null,
  input: null,
  output: null,
}

const queryRefineSlice = createSlice({
  name: StoreKeys.QueryRefine,
  initialState,
  reducers: {
    request(state, action: PayloadAction<QueryRefineParams>) {
      state.loading = true
      state.error = null
      state.input = action.payload
      state.output = null
    },
    requestSuccess(state, action: PayloadAction<QueryRefineResult>) {
      state.loading = false
      state.output = action.payload
      state.error = null
    },
    requestError(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
      state.output = null
    },
    clearState: () => initialState,
  },
})

export const queryRefineActions = queryRefineSlice.actions
export const queryRefineReducer = queryRefineSlice.reducer
