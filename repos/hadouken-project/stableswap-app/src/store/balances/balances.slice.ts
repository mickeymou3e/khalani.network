import { RequestStatus } from '@constants/Request'
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { IBalance } from '@store/pricedBalances/pricedBalances.types'

import { StoreKeys } from '../store.keys'
import { IBalanceSagaState } from './balances.types'

export const balancesAdapter = createEntityAdapter<IBalance>()

const initBalancesSliceState = balancesAdapter.getInitialState<IBalanceSagaState>(
  {
    status: RequestStatus.Idle,
  },
)

export const balancesSlice = createSlice({
  initialState: initBalancesSliceState,
  name: StoreKeys.Balances,
  reducers: {
    updateBalance: (state, action: PayloadAction<IBalance>) => {
      const balance = action.payload
      const oldBalance = balancesAdapter
        .getSelectors()
        .selectById(state, balance.id)

      const newBalance = oldBalance
        ? {
            id: oldBalance.id,
            balances: {
              ...oldBalance.balances,
              ...balance.balances,
            },
          }
        : {
            id: balance.id,
            balances: {
              ...balance.balances,
            },
          }
      balancesAdapter.upsertOne(state, newBalance)
    },
    updateUserBalanceRequest: (state) => {
      state.status = RequestStatus.Pending

      return state
    },
    updateUserBalanceSuccess: (state, action: PayloadAction<IBalance[]>) => {
      const balances = action.payload

      balancesAdapter.upsertMany(state, balances)

      state.status = RequestStatus.Resolved
      return state
    },
    updateUserBalanceFailure: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
    updateBalancesRequest: (state) => {
      state.status = RequestStatus.Pending

      return state
    },
    resetBalancesRequest: (state) => {
      balancesAdapter.removeAll(state)
      state.status = RequestStatus.Pending
      return state
    },
    updateBalancesSuccess: (state, action: PayloadAction<IBalance[]>) => {
      const balances = action.payload

      balancesAdapter.upsertMany(state, balances)

      state.status = RequestStatus.Resolved
      return state
    },
    updateBalancesFailed: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
  },
})

export const balancesActions = balancesSlice.actions
export const balancesReducer = balancesSlice.reducer
