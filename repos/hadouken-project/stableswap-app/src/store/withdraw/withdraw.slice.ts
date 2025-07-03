import { PROPORTIONAL_TOKEN } from '@containers/pools/WithdrawContainer/WithdrawContainer.constants'
import { TokenModelBalanceWithIcon } from '@hadouken-project/ui'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ITokenWithWeight } from '@store/pool/selectors/models/types'
import { TokenBalances } from '@store/userShares/userShares.types'
import { BigDecimal } from '@utils/math'

import { StoreKeys } from '../store.keys'
import {
  CalculateComposablePoolProportionalWithdrawPayload,
  IWithdraw,
  IWithdrawSingleTokenMax,
  IWithdrawTokensMaxBalance,
  WithdrawState,
  InitializeWithdrawSuccess,
  InitializeWithdrawRequest,
} from './withdraw.types'

export const withdrawSlice = createSlice({
  initialState: { ...new WithdrawState() },
  name: StoreKeys.Withdraw,
  reducers: {
    withdrawPreviewRequest: (state) => {
      state.outTokens = []
      state.outTokensAmounts = []
      state.loading = true
      state.withdrawInProgress = false

      return state
    },
    withdrawPreviewRequestSuccess: (
      state,
      action: PayloadAction<IWithdraw>,
    ) => {
      const swap = action.payload

      return {
        ...state,
        ...swap,
        tokensMaxBalance: state.tokensMaxBalance,
        loading: false,
        withdrawInProgress: state.withdrawInProgress,
        openModal: true,
      }
    },
    withdrawPreviewRequestError: (state, error: PayloadAction<string>) => ({
      ...state,
      loading: false,
      error: error.payload,
    }),
    withdrawRequest: (state) => {
      return {
        ...state,
        withdrawInProgress: true,
      }
    },
    withdrawRequestSuccess: (state) => {
      return {
        ...state,
        withdrawInProgress: false,
        loading: false,
      }
    },
    withdrawRequestError: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        withdrawInProgress: false,
        loading: false,
        error: action.payload,
      }
    },
    withdrawSingleTokenMaxRequest: (
      state,
      _action: PayloadAction<IWithdrawSingleTokenMax>,
    ) => ({
      ...state,
      tokensMaxBalance: undefined,
      isMaxAmount: false,
      tokenIndex: null,
    }),
    withdrawSingleTokenRequestUpdate: (
      state,
      action: PayloadAction<IWithdrawTokensMaxBalance>,
    ) => {
      state.tokensMaxBalance = action.payload

      return state
    },
    draggingSlider: (state, action: PayloadAction<boolean>) => {
      state.draggingSlider = action.payload
      return state
    },

    calculateComposablePoolProportionalWithdrawRequest: (
      state,
      _action: PayloadAction<CalculateComposablePoolProportionalWithdrawPayload>,
    ) => {
      state.isFetchingComposableProportions = true

      return state
    },

    calculateComposablePoolProportionalWithdrawSuccess: (
      state,
      action: PayloadAction<{
        balances: TokenBalances
        percentage: number
      }>,
    ) => {
      const { balances, percentage } = action.payload
      state.isFetchingComposableProportions = false
      state.composablePoolProportionalBalances = balances

      const isZeroTokensBalance = Object.keys(balances).every((address) =>
        balances[address]?.toBigNumber()?.eq(0),
      )

      if (isZeroTokensBalance) {
        state.displayImbalanceComposablePoolWithSignificantUserHoldingBanner = false

        return state
      }

      const isValueNotProportionalBecauseOfPoolImbalance =
        percentage > 0 &&
        Object.keys(balances).some((address) =>
          balances[address]?.toBigNumber()?.eq(0),
        )

      state.displayImbalanceComposablePoolWithSignificantUserHoldingBanner = isValueNotProportionalBecauseOfPoolImbalance

      return state
    },
    calculateComposablePoolProportionalWithdrawFailure: (state) => {
      state.isFetchingComposableProportions = false
      state.composablePoolProportionalBalances = {}
      return state
    },
    openModal: (state, action: PayloadAction<boolean>) => {
      state.openModal = action.payload

      return state
    },
    setSelectedToken: (
      state,
      action: PayloadAction<TokenModelBalanceWithIcon>,
    ) => {
      state.selectedToken = action.payload

      return state
    },
    setShowWrappedCheckbox: (state, action: PayloadAction<boolean>) => {
      state.showWrappedCheckbox = action.payload

      return state
    },
    wrappedTokenChangeRequest: (state, action: PayloadAction<boolean>) => {
      state.showWrappedTokens = action.payload
      state.isFetchingComposableProportions = true

      return state
    },
    wrappedTokenChangeSuccess: (
      state,
      action: PayloadAction<{
        balances: TokenBalances
        percentage: number
      }>,
    ) => {
      const { balances, percentage } = action.payload
      state.isFetchingComposableProportions = false
      state.composablePoolProportionalBalances = balances

      const isZeroTokensBalance = Object.keys(balances).every((address) =>
        balances[address]?.toBigNumber()?.eq(0),
      )

      if (isZeroTokensBalance) {
        state.displayImbalanceComposablePoolWithSignificantUserHoldingBanner = false

        return state
      }

      const isValueNotProportionalBecauseOfPoolImbalance =
        percentage > 0 &&
        Object.keys(balances).some((address) =>
          balances[address]?.toBigNumber()?.eq(0),
        )

      state.displayImbalanceComposablePoolWithSignificantUserHoldingBanner = isValueNotProportionalBecauseOfPoolImbalance

      return state
    },
    setWithdrawTokens: (
      state,
      action: PayloadAction<{
        withdrawTokens: ITokenWithWeight[]
        proportionalToken: TokenModelBalanceWithIcon
      }>,
    ) => {
      state.withdrawTokens = action.payload.withdrawTokens
      state.proportionalToken = action.payload.proportionalToken

      return state
    },
    setPercentage: (state, action: PayloadAction<number>) => {
      state.percentage = action.payload

      const isProportional =
        state.selectedToken?.symbol === PROPORTIONAL_TOKEN.symbol

      if (isProportional) {
        if (action.payload === 0) {
          state.buttonDisabled = true
        } else {
          state.buttonDisabled = false
        }
      }

      return state
    },
    setSlippage: (state, action: PayloadAction<BigDecimal>) => {
      state.slippage = action.payload

      return state
    },
    amountChangeRequest: (state, _action: PayloadAction<BigDecimal>) => state,
    amountChangeSuccess: (
      state,
      action: PayloadAction<{
        withdrawAmount: BigDecimal
        priceImpact: string
        buttonDisabled: boolean
      }>,
    ) => {
      state.withdrawAmount = action.payload.withdrawAmount
      state.priceImpact = action.payload.priceImpact
      state.buttonDisabled = action.payload.buttonDisabled

      return state
    },
    withdrawInitializeRequest: (
      state,
      _action: PayloadAction<InitializeWithdrawRequest>,
    ) => {
      return state
    },
    withdrawInitializeSuccess: (
      state,
      action: PayloadAction<InitializeWithdrawSuccess>,
    ) => {
      const {
        poolId,
        buttonDisabled,
        userMaxLpTokenBalance,
        isUserShareGreaterThanMaximumShare,
        isInitialized,
      } = action.payload

      state.poolId = poolId
      state.buttonDisabled = buttonDisabled
      state.userMaxLpTokenBalance = userMaxLpTokenBalance
      state.isUserShareGreaterThanMaximumShare = isUserShareGreaterThanMaximumShare
      state.isInitialized = isInitialized

      return state
    },
    resetWithdrawState: () => {
      return {
        ...new WithdrawState(),
      }
    },
  },
})

export const withdrawActions = withdrawSlice.actions
export const withdrawReducer = withdrawSlice.reducer
