import { Network } from '@constants/Networks'
import { RequestStatus } from '@constants/Request'
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

import { IKhalaBalances, IKhalaBalancesSagaState } from './balances.types'

export const khalaBalancesAdapter = createEntityAdapter<IKhalaBalances>()

const initKhalaBalancesSliceState = khalaBalancesAdapter.getInitialState<IKhalaBalancesSagaState>(
  {
    status: RequestStatus.Idle,
    isFetching: false,
  },
)

export const KhalaBalancesSlice = createSlice({
  initialState: initKhalaBalancesSliceState,
  name: StoreKeys.KhalaBalances,
  reducers: {
    initializeKhalaBalancesRequest: (state) => ({ ...state, isFetching: true }),
    initializeKhalaBalancesSuccess: (state) => ({
      ...state,
      isFetching: false,
      status: RequestStatus.Resolved,
    }),
    initializeKhalaBalancesFailure: (state) => ({
      ...state,
      isFetching: false,
      status: RequestStatus.Rejected,
    }),
    updateKhalaBalances: (state, action: PayloadAction<IKhalaBalances[]>) => {
      const tokens = action.payload
      khalaBalancesAdapter.upsertMany(state, tokens)
    },
    updateOnlyChainIdWithTokens: (state, action: PayloadAction<Network>) => ({
      ...state,
      onlyChainIdWithTokens: action.payload,
    }),
  },
})

export const khalaBalancesActions = KhalaBalancesSlice.actions
export const khalaBalancesReducer = KhalaBalancesSlice.reducer
