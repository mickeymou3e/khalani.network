import { RequestStatus } from '@constants/Request'
import { IInitializeSaga } from '@interfaces/data'
import { createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'

const initialState: IInitializeSaga = {
  status: RequestStatus.Idle,
}

export const InitializeStoreSlice = createSlice({
  initialState,
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
