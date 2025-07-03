import { ActionInProgress } from '@interfaces/action'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { ContractsSliceState } from './contracts.types'

const initContractsState: ContractsSliceState = {
  errorMessage: undefined,
  actionInProgress: undefined,
}

export const contractsSlice = createSlice({
  initialState: initContractsState,
  name: StoreKeys.Contracts,
  reducers: {
    setActionInProgress: (state, action: PayloadAction<ActionInProgress>) => {
      state.actionInProgress = action.payload
      return state
    },
    finishActionInProgress: (state) => {
      state.actionInProgress = undefined
      return state
    },
    setError: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload
      return state
    },
    clearError: (state) => {
      return { ...state, errorMessage: undefined }
    },
  },
})

export const contractsActions = contractsSlice.actions
export const contractsReducer = contractsSlice.reducer
