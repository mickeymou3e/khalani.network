import { ITokenBalance } from '@interfaces/tokens'
import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { IBalance } from './balances.types'

export const balancesAdapter = createEntityAdapter<IBalance>()

const initBalancesSliceState = balancesAdapter.getInitialState()

export const balancesSlice = createSlice({
  initialState: initBalancesSliceState,
  name: StoreKeys.Balances,
  reducers: {
    fetchLiquidatorBalancesRequest: (state, _action: PayloadAction) => state,
    updateBalancesRequest: (state, _action: PayloadAction<ITokenBalance[]>) =>
      state,
    updateBalancesSuccess: (state, action: PayloadAction<IBalance>) => {
      const stateBalances = balancesAdapter.getSelectors().selectEntities(state)

      const stateBalance = stateBalances[action.payload.id]
        ? stateBalances[action.payload.id]?.balances
        : {}

      balancesAdapter.upsertOne(state, {
        id: action.payload.id,
        balances: { ...stateBalance, ...action.payload.balances },
      })
      return state
    },
    fetchOracleBalancesRequest: (state, _action: PayloadAction<string>) =>
      state,
    updateOracleBalancesRequest: (
      state,
      _action: PayloadAction<ITokenBalance[]>,
    ) => state,
    updateOracleBalancesSuccess: (state, action: PayloadAction<IBalance>) => {
      const stateBalances = balancesAdapter.getSelectors().selectEntities(state)

      const stateBalance = stateBalances[action.payload.id]
        ? stateBalances[action.payload.id]?.balances
        : {}

      balancesAdapter.upsertOne(state, {
        id: action.payload.id,
        balances: { ...stateBalance, ...action.payload.balances },
      })
      return state
    },
    fetchTreasuryBalanceRequest: (state, _action: PayloadAction) => state,
    fetchProtocolFeeBalanceRequest: (state, _action: PayloadAction) => state,
  },
})

export const balancesActions = balancesSlice.actions
export const balancesReducer = balancesSlice.reducer
