import { RequestStatus } from '@constants/Request'
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { IBalances, IBalancesSagaState } from './balances.types'

export const balancesAdapter = createEntityAdapter<IBalances>()

const initBalancesSliceState =
  balancesAdapter.getInitialState<IBalancesSagaState>({
    status: RequestStatus.Idle,
    isFetching: false,
  })

export const BalancesSlice = createSlice({
  initialState: initBalancesSliceState,
  name: StoreKeys.Balances,
  reducers: {
    initializeBalancesRequest: (state) => ({ ...state, isFetching: true }),
    initializeBalancesSuccess: (state) => ({
      ...state,
      isFetching: false,
      status: RequestStatus.Resolved,
    }),
    initializeBalancesFailure: (state) => ({
      ...state,
      isFetching: false,
      status: RequestStatus.Rejected,
    }),
    updateBalances: (state, action: PayloadAction<IBalances[]>) => {
      const tokens = action.payload
      balancesAdapter.upsertMany(state, tokens)
    },
  },
})

export const balancesActions = BalancesSlice.actions
export const balancesReducer = BalancesSlice.reducer
