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
    status: RequestStatus.Idle,
  },
)

export const pricedBalancesSlice = createSlice({
  initialState: initBalancesSliceState,
  name: StoreKeys.PricedBalances,
  reducers: {
    updateRequest: (state) => state,
    updateSuccess: (state, action: PayloadAction<IBalance[]>) => {
      const balances = action.payload

      balancesAdapter.upsertMany(state, balances)

      state.status = RequestStatus.Resolved
      return state
    },
    updateFailure: (state) => {
      state.status = RequestStatus.Rejected
      return state
    },
  },
})

export const pricedBalancesActions = pricedBalancesSlice.actions
export const pricedBalancesReducer = pricedBalancesSlice.reducer
