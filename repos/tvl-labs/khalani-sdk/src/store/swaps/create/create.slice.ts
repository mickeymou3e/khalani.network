import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '../../store.keys'
import {
  UIIntentParams,
  ICreateIntentSliceState,
  Intent,
  CreateIntentResult,
} from './create.types'
import { APIError } from '@interfaces/api'

const initCreateIntentSliceState: ICreateIntentSliceState = {
  loading: false,
  initialized: false,
  signed: false,
  intent: null,
  params: null,
  error: null,
  depositId: null,
}

export const createIntentSlice = createSlice({
  initialState: initCreateIntentSliceState,
  name: StoreKeys.CreateIntent,
  reducers: {
    request: (state, action: PayloadAction<UIIntentParams | Intent>) => ({
      ...state,
      params: action.payload,
      loading: true,
      isInitialized: false,
      error: null,
    }),
    requestSuccess: (state, action: PayloadAction<CreateIntentResult>) => ({
      ...state,
      ...action.payload,
      loading: false,
      initialized: true,
      error: null,
    }),
    requestError: (state, error: PayloadAction<APIError>) => ({
      ...state,
      error: error.payload,
      initialized: false,
    }),
    signed: (state) => ({
      ...state,
      signed: true,
    }),
    clearState: () => initCreateIntentSliceState,
  },
})

export const createIntentActions = createIntentSlice.actions
export const createIntentReducer = createIntentSlice.reducer
