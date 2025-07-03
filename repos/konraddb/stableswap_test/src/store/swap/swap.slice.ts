import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { ISwap, ISwapRequest, ISwapSliceState } from './swap.types'

const initSwapSliceState: ISwapSliceState = {
  loading: false,
}

export const swapSlice = createSlice({
  initialState: initSwapSliceState,
  name: StoreKeys.Swap,
  reducers: {
    swapPreviewRequest: (state, _action: PayloadAction<ISwapRequest>) => ({
      ...state,
      loading: true,
    }),
    swapPreviewRequestSuccess: (_state, action: PayloadAction<ISwap>) => {
      const swap = action.payload

      return {
        ...swap,
        loading: false,
      }
    },
    swapPreviewRequestError: (state, error: PayloadAction<string>) => ({
      ...state,
      loading: false,
      error: error.payload,
    }),
    swapRequest: (state) => state,
    swapRequestSuccess: () => {
      return {
        loading: false,
      }
    },
    swapRequestError: (state, error: PayloadAction<string>) => ({
      ...state,
      loading: false,
      error: error.payload,
    }),
  },
})

export const swapActions = swapSlice.actions
export const swapReducer = swapSlice.reducer
