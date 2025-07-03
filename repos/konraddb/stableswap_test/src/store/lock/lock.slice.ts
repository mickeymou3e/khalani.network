import { Network } from '@constants/Networks'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { ILockRequest, ILockSliceState } from './lock.types'

const initLockSliceState: ILockSliceState = {
  loading: false,
  user: '',
  token: '',
  amount: undefined,
  destinationChain: undefined,
}

export const lockSlice = createSlice({
  initialState: initLockSliceState,
  name: StoreKeys.Lock,
  reducers: {
    lockPreviewRequest: (state, _action: PayloadAction<ILockRequest>) => ({
      ...state,
      loading: true,
    }),
    lockPreviewRequestSuccess: (state, action: PayloadAction<ILockRequest>) => {
      const swap = action.payload

      return {
        ...swap,
        loading: false,
      }
    },
    lockPreviewRequestError: (state, error: PayloadAction<string>) => ({
      ...state,
      error: error.payload,
    }),
    lockPreviewReset: (state) => {
      return state
    },
    lockRequest: (state, payload: PayloadAction<ILockRequest>) => ({
      ...state,
      payload,
    }),
    lockRequestError: (state, error: PayloadAction<string>) => ({
      ...state,
      loading: false,
      error: error.payload,
    }),
    updateDestinationChain: (state, action: PayloadAction<Network>) => ({
      ...state,
      destinationChain: action.payload,
    }),
  },
})

export const lockActions = lockSlice.actions
export const lockReducer = lockSlice.reducer
