import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'
import { ISwap } from '@store/swap/swap.types'

const swap = createSelector(
  [selectReducer(StoreKeys.Swap)],
  (reducerState) =>
    ({
      inToken: reducerState?.inToken,
      inTokenAmount: reducerState?.inTokenAmount,
      outToken: reducerState?.outToken,
      outTokenAmount: reducerState?.outTokenAmount,
      swapKind: reducerState?.swapKind,
      funds: reducerState?.funds,
      limits: reducerState?.limits,
      sorSwaps: reducerState?.sorSwaps,
      sorTokens: reducerState?.sorTokens,
      fee: reducerState?.fee,
      slippage: reducerState?.slippage,
    } as ISwap),
)

const swapReady = createSelector(
  [selectReducer(StoreKeys.Swap)],
  (reduceState) => reduceState.inToken && reduceState.outToken,
)

const swapLoading = createSelector(
  [selectReducer(StoreKeys.Swap)],
  (reducerState) => reducerState?.loading,
)

export const swapSelectors = {
  swap,
  swapReady,
  swapLoading,
}
