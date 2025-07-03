import { RequestStatus } from '@constants/Request'
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

import {
  INativeBalances,
  INativeBalancesSagaState,
} from './nativeBalances.types'

export const nativeBalancesAdapter = createEntityAdapter<INativeBalances>()

const initNativeBalancesSliceState =
  nativeBalancesAdapter.getInitialState<INativeBalancesSagaState>({
    status: RequestStatus.Idle,
    isFetching: false,
  })

export const NativeBalancesSlice = createSlice({
  initialState: initNativeBalancesSliceState,
  name: StoreKeys.NativeBalances,
  reducers: {
    updateNativeBalancesRequest: (state) => ({
      ...state,
      isFetching: true,
    }),
    updateNativeBalancesSuccess: (state) => ({
      ...state,
      isFetching: false,
      status: RequestStatus.Resolved,
    }),
    updateNativeBalancesFailure: (state) => ({
      ...state,
      isFetching: false,
      status: RequestStatus.Rejected,
    }),
    updateNativeBalances: (state, action: PayloadAction<INativeBalances[]>) => {
      const tokens = action.payload
      nativeBalancesAdapter.removeAll(state)
      nativeBalancesAdapter.upsertMany(state, tokens)
    },
  },
})

export const nativeBalancesActions = NativeBalancesSlice.actions
export const nativeBalancesReducer = NativeBalancesSlice.reducer
