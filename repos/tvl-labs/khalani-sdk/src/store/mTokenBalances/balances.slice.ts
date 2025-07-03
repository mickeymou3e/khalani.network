import { RequestStatus } from '@constants/Request'
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { IBalancesSagaState, IMTokenBalances } from './balances.types'

export const mTokenBalancesAdapter = createEntityAdapter<IMTokenBalances>()

const initBalancesSliceState =
  mTokenBalancesAdapter.getInitialState<IBalancesSagaState>({
    status: RequestStatus.Idle,
    isFetching: false,
    isInitialized: false,
  })

export const BalancesSlice = createSlice({
  initialState: initBalancesSliceState,
  name: StoreKeys.MTokenBalances,
  reducers: {
    initializeBalancesRequest: (state) => ({ ...state, isFetching: true }),
    initializeBalancesSuccess: (state) => ({
      ...state,
      isFetching: false,
      isInitialized: true,
      status: RequestStatus.Resolved,
    }),
    initializeBalancesFailure: (state) => ({
      ...state,
      isFetching: false,
      status: RequestStatus.Rejected,
    }),
    updateBalances: (state, action: PayloadAction<IMTokenBalances[]>) => {
      const balances = action.payload
      mTokenBalancesAdapter.upsertMany(state, balances)
    },
  },
})

export const mTokenBalancesActions = BalancesSlice.actions
export const mTokenBalancesReducer = BalancesSlice.reducer
