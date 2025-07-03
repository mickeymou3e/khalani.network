import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '@store/store.keys'
import { SafeSliceState } from './safe.types'
import config from '@config'

const initialState: SafeSliceState = {
  address: null,
  deployed: null,
  adapterAddress: config.contracts.SafeAdapter
}

export const slice = createSlice({
  initialState: initialState,
  name: StoreKeys.Safe,
  reducers: {
    update: (state, action: PayloadAction<Pick<SafeSliceState, 'address' | 'deployed'>>) => {
      state = { ...state, ...action.payload };

      return state;
    }
  },
})

export const safeActions = slice.actions
export const safeReducer = slice.reducer
