import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { CreateRefineResult, CreateRefineSagaParams } from './create.types'

export interface CreateRefineState {
  loading: boolean
  error: string | null
  input: CreateRefineSagaParams | null
  output: CreateRefineResult | null
}

const initialState: CreateRefineState = {
  loading: false,
  error: null,
  input: null,
  output: null,
}

const createRefineSlice = createSlice({
  name: StoreKeys.CreateRefine,
  initialState,
  reducers: {
    request(state, action: PayloadAction<CreateRefineSagaParams>) {
      state.loading = true
      state.error = null
      state.input = action.payload
      state.output = null
    },
    requestSuccess(state, action: PayloadAction<CreateRefineResult>) {
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

export const createRefineActions = createRefineSlice.actions
export const createRefineReducer = createRefineSlice.reducer
