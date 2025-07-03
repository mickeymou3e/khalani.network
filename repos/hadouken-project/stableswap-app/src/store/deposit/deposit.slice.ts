import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { PoolType } from '../../interfaces/pool'
import { BigDecimal, ONE_PERCENT } from '../../utils/math'
import { StoreKeys } from '../store.keys'
import {
  AmountChangeRequestPayload,
  AmountChangeSuccessPayload,
  DepositEditorState,
  InitializeDepositSuccessPayload,
  ProportionalSuggestionSuccessPayload,
  WrappedTokenChangeSuccessPayload,
} from './deposit.types'

export const depositSlice = createSlice({
  initialState: { ...new DepositEditorState() },
  name: StoreKeys.Deposit,
  reducers: {
    depositPreviewRequest: (state): DepositEditorState => {
      return {
        ...state,
        isLoadingPreview: true,
      }
    },
    depositPreviewRequestSuccess: (
      state,
      _action: PayloadAction<BigDecimal>,
    ): DepositEditorState => {
      return {
        ...state,
        showDepositPreviewModal: true,
        isLoadingPreview: false,
      }
    },
    depositPreviewRequestError: (state): DepositEditorState => ({
      ...state,
      isLoadingPreview: false,
    }),

    onSlippageChange: (
      state,
      action: PayloadAction<BigDecimal>,
    ): DepositEditorState => {
      return {
        ...state,
        slippage: action.payload,
      }
    },
    depositPreviewReset: (state): DepositEditorState => {
      return state
    },
    depositRequest: (state): DepositEditorState => {
      return {
        ...state,
        depositInProgress: true,
      }
    },
    depositRequestSuccess: (state): DepositEditorState => {
      return {
        ...state,
        depositInProgress: false,
      }
    },
    depositRequestError: (state): DepositEditorState => {
      return {
        ...state,
        depositInProgress: false,
      }
    },

    initializeDepositRequest: (
      state,
      _action: PayloadAction<string>,
    ): DepositEditorState => {
      return state
    },

    initializeDepositSuccess: (
      state,
      action: PayloadAction<InitializeDepositSuccessPayload>,
    ): DepositEditorState => {
      return {
        ...state,
        buttonDisabled: true,
        isFetchingTokens: false,
        showWrappedTokens: false,
        showDepositPreviewModal: false,
        depositInProgress: false,
        isLoadingPreview: false,

        poolId: action.payload.poolId,
        poolType: action.payload.poolType,
        proportionalCalculationForToken: null,
        priceImpact: '0.00%',
        minBptTokensOut: BigDecimal.from(0),
        slippage: BigDecimal.from(ONE_PERCENT),
        totalDepositValueUSD: BigDecimal.from(0),
        depositTokens: action.payload.depositTokens,
        showLowLiquidityBanner: action.payload.showLowLiquidityBanner,
        showWrappedCheckbox: action.payload.showWrappedCheckbox,
      }
    },

    amountChangeRequest: (
      state,
      _action: PayloadAction<AmountChangeRequestPayload>,
    ): DepositEditorState => {
      return {
        ...state,
      }
    },

    amountChangeSuccess: (
      state,
      action: PayloadAction<AmountChangeSuccessPayload>,
    ): DepositEditorState => {
      return {
        ...state,
        ...action.payload,
      }
    },

    tokenInputFocus: (
      state,
      action: PayloadAction<string>,
    ): DepositEditorState => {
      const focusToken = state.depositTokens.find(
        (tok) => tok.address === action.payload,
      )

      return {
        ...state,
        proportionalCalculationForToken:
          focusToken?.amount?.gt(0) && state.poolType === PoolType.Weighted
            ? action.payload
            : null,
      }
    },

    wrappedTokenChangeRequest: (
      state,
      _action: PayloadAction<boolean>,
    ): DepositEditorState => {
      return state
    },

    wrappedTokenChangeSuccess: (
      state,
      action: PayloadAction<WrappedTokenChangeSuccessPayload>,
    ): DepositEditorState => {
      return {
        ...state,
        ...action.payload,
      }
    },

    stakeToBackstopChange: (
      state,
      action: PayloadAction<boolean>,
    ): DepositEditorState => {
      state.stakeToBackstop = action.payload
      return state
    },

    proportionalSuggestionRequest: (
      state,
      _action: PayloadAction<string>,
    ): DepositEditorState => {
      return state
    },

    proportionalSuggestionSuccess: (
      state,
      action: PayloadAction<ProportionalSuggestionSuccessPayload>,
    ): DepositEditorState => {
      return {
        ...state,
        ...action.payload,
      }
    },

    depositPreviewModalChange: (
      state,
      action: PayloadAction<boolean>,
    ): DepositEditorState => {
      return {
        ...state,
        showDepositPreviewModal: action.payload,
      }
    },

    resetDepositState: (_state): DepositEditorState => {
      return {
        ...new DepositEditorState(),
      }
    },
  },
})

export const depositActions = depositSlice.actions
export const depositReducer = depositSlice.reducer
export const depositInitialState = new DepositEditorState()
