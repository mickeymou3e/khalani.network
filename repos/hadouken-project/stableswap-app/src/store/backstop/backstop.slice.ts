import { Liquidation } from '@dataSource/graph/backstop/types'
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { BigDecimal } from '@utils/math'

import { StoreKeys } from '../store.keys'
import {
  BackstopDepositRequestPayload,
  BackstopDepositSuccessPayload,
  BackstopWithdrawRequestPayload,
  InitializeBackstopSuccessPayload,
  LiquidationReduxState,
} from './backstop.types'

export const liquidationsAdapter = createEntityAdapter<Liquidation>()

const initialState: LiquidationReduxState = {
  initialized: null,
  liquidationToken: null,
  backstopToken: null,
  backstopTotalBalance: BigDecimal.from(0),
  apr: BigDecimal.from(0, 27),
  liquidations: liquidationsAdapter.getInitialState(),
  hasMore: true,
}

export const backstopSlice = createSlice({
  initialState,
  name: StoreKeys.Backstop,
  reducers: {
    initializeBackstopRequest: (state) => {
      state.initialized = false
      return state
    },
    initializeBackstopSuccess: (
      state,
      action: PayloadAction<InitializeBackstopSuccessPayload>,
    ) => {
      state.liquidationToken = action.payload.liquidationToken
      state.backstopToken = action.payload.backstopToken
      state.initialized = true
      state.backstopTotalBalance = action.payload.poolTotalBalance
      state.apr = action.payload.apr
      state.hasMore = action.payload.hasMore

      liquidationsAdapter.upsertMany(
        state.liquidations,
        action.payload.liquidations,
      )

      return state
    },
    initializeBackstopFailure: (state) => state,

    depositToBackstopRequest: (
      state,
      _action: PayloadAction<BackstopDepositRequestPayload>,
    ) => state,
    depositToBackstopSuccess: (
      state,
      action: PayloadAction<BackstopDepositSuccessPayload>,
    ) => {
      state.backstopTotalBalance = action.payload.backstopTotalBalance
      return state
    },
    depositToBackstopFailure: (state) => state,

    backstopWithdrawRequest: (
      state,
      _action: PayloadAction<BackstopWithdrawRequestPayload>,
    ) => state,
    backstopWithdrawSuccess: (
      state,
      action: PayloadAction<BackstopDepositSuccessPayload>,
    ) => {
      state.backstopTotalBalance = action.payload.backstopTotalBalance
      return state
    },
    backstopWithdrawFailure: (state) => state,

    loadMoreLiquidationsRequest: (
      state,
      _action: PayloadAction<{ chainId: string; limit: number; skip: number }>,
    ) => state,

    loadMoreLiquidationsSuccess: (
      state,
      action: PayloadAction<{ liquidations: Liquidation[]; hasMore: boolean }>,
    ) => {
      liquidationsAdapter.upsertMany(
        state.liquidations,
        action.payload.liquidations,
      )
      state.hasMore = action.payload.hasMore

      return state
    },
    loadMoreLiquidationsFailure: (state) => state,
  },
})

export const backstopActions = backstopSlice.actions
export const backstopReducer = backstopSlice.reducer
