import { RequestStatus } from '@constants/Request'
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { IBalance, IBalanceSagaState } from './pricedBalances.types'

export const balancesAdapter = createEntityAdapter<IBalance>()

const initBalancesSliceState = balancesAdapter.getInitialState<IBalanceSagaState>(
  {
    isFetching: true,
    status: RequestStatus.Idle,
  },
)

export const pricedBalancesSlice = createSlice({
  initialState: initBalancesSliceState,
  name: StoreKeys.PricedBalances,
  reducers: {
    updateRequest: (state) => {
      state.isFetching = true
      return state
    },
    updateSuccess: (state, action: PayloadAction<IBalance[]>) => {
      const balances = action.payload

      balancesAdapter.setAll(state, balances)
      state.isFetching = false
      state.status = RequestStatus.Resolved
      return state
    },
    updateFailure: (state) => {
      state.status = RequestStatus.Rejected
      state.isFetching = false
      return state
    },
  },
})

export const pricedBalancesActions = pricedBalancesSlice.actions
export const pricedBalancesReducer = pricedBalancesSlice.reducer
