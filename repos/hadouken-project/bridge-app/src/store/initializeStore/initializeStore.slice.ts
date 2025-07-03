import { RequestStatus } from '@constants/Request'
import { createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { InitializeStoreState } from './initializeStore.types'

export const InitializeStoreSlice = createSlice({
  initialState: { ...new InitializeStoreState() },
  name: StoreKeys.InitializeStore,
  reducers: {
    initializeStoreSuccess: (state) => {
      state.status = RequestStatus.Resolved
      return state
    },
    initializeStoreFailure: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
    initializeStoreRequest: (state) => {
      state.status = RequestStatus.Pending
      return state
    },
  },
})

export const initializeStoreActions = InitializeStoreSlice.actions
export const initializeStoreReducer = InitializeStoreSlice.reducer
