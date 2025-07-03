import { BigNumber } from 'ethers'

import { SLIPPAGE_DEFAULT_VALUE } from '@containers/pools/constants'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BigDecimal } from '@utils/math'

import { StoreKeys } from '../store.keys'
import { ISwap, ISwapSliceState } from './swap.types'

const initSwapSliceState: ISwapSliceState = {
  loading: false,
  swapInProgress: false,
  slippage: SLIPPAGE_DEFAULT_VALUE,
}

export const swapSlice = createSlice({
  initialState: initSwapSliceState,
  name: StoreKeys.Swap,
  reducers: {
    initializeSwapStoreRequest: (state) => state,
    initializeSwapStoreSuccess: (
      state,
      action: PayloadAction<
        Pick<ISwapSliceState, 'baseTokenAddress' | 'quoteTokenAddress'>
      >,
    ) => {
      return {
        ...state,
        baseTokenAddress: action.payload.baseTokenAddress,
        quoteTokenAddress: action.payload.quoteTokenAddress,
      }
    },
    initializeSwapStoreFailure: (state) => state,

    setBaseToken: (state, action: PayloadAction<string>) => {
      state.baseTokenAddress = action.payload

      return state
    },
    setQuoteToken: (state, action: PayloadAction<string>) => {
      state.quoteTokenAddress = action.payload
      if (state.baseTokenValue?.toBigNumber().gt(BigNumber.from(0))) {
        state.loading = true
      }
      return state
    },
    onInputChange: (state, action: PayloadAction<BigDecimal | undefined>) => {
      state.baseTokenValue = action.payload
      if (action.payload?.toBigNumber().gt(BigNumber.from(0))) {
        state.loading = true
      }

      return state
    },
    setSlippage: (state, action: PayloadAction<BigDecimal>) => {
      return {
        ...state,
        slippage: action.payload,
      }
    },
    reverseSwapTokens: (state) => {
      const baseTokenPrevious = state.baseTokenAddress

      state.baseTokenAddress = state.quoteTokenAddress

      state.quoteTokenAddress = baseTokenPrevious

      state.baseTokenValue = state.outTokenAmount

      return state
    },
    swapPreviewRequest: (state) => state,
    swapPreviewRequestSuccess: (
      state,
      action: PayloadAction<ISwap & { quotePrice: string | null }>,
    ) => {
      const swap = action.payload

      return {
        ...state,
        ...swap,
        loading: false,
        swapInProgress: false,
      }
    },
    swapPreviewRequestError: (state) => ({
      ...state,
      loading: false,
      isUnderPerformance: false,
      quotePrice: null,
    }),
    swapPreviewRequestClean: (state) => ({
      loading: false,
      swapInProgress: false,
      slippage: state.slippage,
      baseTokenAddress: state.baseTokenAddress,
      quoteTokenAddress: state.quoteTokenAddress,
    }),
    swapRequest: (state) => {
      return {
        ...state,
        swapInProgress: true,
      }
    },
    swapRequestSuccess: (state) => {
      return {
        loading: false,
        swapInProgress: false,
        slippage: state.slippage,
      }
    },
    swapRequestError: (state) => {
      return {
        loading: false,
        swapInProgress: false,
        slippage: state.slippage,
      }
    },
  },
})

export const swapActions = swapSlice.actions
export const swapReducer = swapSlice.reducer
