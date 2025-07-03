import { RequestStatus } from '@constants/Request'
import { IInitializeSaga } from '@interfaces/data'
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

import { SwapToken } from './swapTokens.types'

export const swapTokensAdapter = createEntityAdapter<SwapToken>({
  selectId: (token) => token.address,
})

const initTokensSliceState = swapTokensAdapter.getInitialState<IInitializeSaga>(
  {
    status: RequestStatus.Idle,
  },
)

export const swapTokensSlice = createSlice({
  initialState: initTokensSliceState,
  name: StoreKeys.SwapTokens,
  reducers: {
    fetchSwapTokensRequest: (state) => state,
    fetchSwapTokensSuccess: (state, action: PayloadAction<SwapToken[]>) => {
      state.status = RequestStatus.Resolved

      swapTokensAdapter.upsertMany(state, action.payload)

      return state
    },
    fetchSwapTokensFailure: (state) => {
      state.status = RequestStatus.Rejected

      return state
    },
  },
})

export const swapTokensActions = swapTokensSlice.actions
export const swapTokensReducer = swapTokensSlice.reducer
