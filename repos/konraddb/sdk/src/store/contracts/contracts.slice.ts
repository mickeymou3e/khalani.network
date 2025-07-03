import config from '../../config'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { ContractsSliceState } from './contracts.types'

const initContractsState: ContractsSliceState = {
  axonCrossChainRouterAddress: config.contracts.NexusDiamond,
  errorMessage: undefined,
}

export const contractsSlice = createSlice({
  initialState: initContractsState,
  name: StoreKeys.Contracts,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload
      return state
    },
  },
})

export const contractsActions = contractsSlice.actions
export const contractsReducer = contractsSlice.reducer
