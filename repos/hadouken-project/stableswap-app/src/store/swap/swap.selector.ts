import { BigNumber } from 'ethers'

import { isCustomLinearPool } from '@containers/pools/utils'
import { PoolType } from '@interfaces/pool'
import { createSelector } from '@reduxjs/toolkit'
import { userBalancesSelectors } from '@store/balances/selectors/user/balances.selector'
import { networkSelectors } from '@store/network/network.selector'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'
import { ISwap } from '@store/swap/swap.types'
import { BigDecimal } from '@utils/math'

import { poolSelectors } from '../pool/selectors/pool.selector'

const swap = createSelector(
  [selectReducer(StoreKeys.Swap)],
  (reducerState) =>
    ({
      inToken: reducerState?.inToken,
      inTokenAmount: reducerState?.inTokenAmount,
      outToken: reducerState?.outToken,
      outTokenAmount: reducerState?.outTokenAmount,
      outTokenAmountWithSlippage: reducerState?.outTokenAmountWithSlippage,
      swapKind: reducerState?.swapKind,
      swapNodes: reducerState?.swapNodes,
      funds: reducerState?.funds,
      limits: reducerState?.limits,
      sorSwaps: reducerState?.sorSwaps,
      sorTokens: reducerState?.sorTokens,
      fee: reducerState?.fee,
      slippage: reducerState?.slippage,
      spotPrice: reducerState?.spotPrice,
      isUnderPerformance: reducerState?.isUnderPerformance,
      priceImpact: reducerState?.priceImpact,
      isInsufficientLiquidity: reducerState?.isInsufficientLiquidity,
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

const isSingleSwapThroughLinear = createSelector(
  [
    selectReducer(StoreKeys.Swap),
    poolSelectors.selectById,
    networkSelectors.applicationChainId,
  ],
  (reducerState, selectPoolById, applicationChainId) => {
    if (!reducerState?.sorSwaps) return false
    const pool = selectPoolById(reducerState.sorSwaps[0].poolId)

    return (
      pool &&
      reducerState.sorSwaps.length === 1 &&
      (isCustomLinearPool(applicationChainId, pool.address) ||
        pool?.poolType === PoolType.AaveLinear) // remove after deploy new boosted pools
    )
  },
)

const isSwapInProgress = createSelector(
  selectReducer(StoreKeys.Swap),
  (reducerState) => reducerState.swapInProgress,
)

const swapTokensAddresses = createSelector(
  selectReducer(StoreKeys.Swap),
  (reducerState) => {
    return {
      baseTokenAddress: reducerState.baseTokenAddress,
      quoteTokenAddress: reducerState.quoteTokenAddress,
    }
  },
)
const baseTokenValue = createSelector(
  selectReducer(StoreKeys.Swap),
  (reducerState) => reducerState.baseTokenValue,
)

const quotePrice = createSelector(
  selectReducer(StoreKeys.Swap),
  (reducerState) => reducerState.quotePrice,
)

const slippage = createSelector(
  selectReducer(StoreKeys.Swap),
  (reducerState) => reducerState.slippage,
)

const swapDisabled = createSelector(
  [selectReducer(StoreKeys.Swap), userBalancesSelectors.selectUserTokenBalance],
  (reducerState, selectUserTokenBalance) => {
    if (!reducerState.baseTokenAddress) return true

    const userBaseTokenBalance =
      selectUserTokenBalance(reducerState.baseTokenAddress) ??
      BigDecimal.from(0)

    return (
      !reducerState.baseTokenValue ||
      reducerState.baseTokenValue.toBigNumber().eq(BigNumber.from(0)) ||
      userBaseTokenBalance.lt(reducerState.baseTokenValue) ||
      reducerState.outTokenAmount?.toBigNumber().eq(BigNumber.from(0)) ||
      reducerState.loading ||
      !reducerState.quotePrice
    )
  },
)

const disabledSwapIcon = createSelector(
  selectReducer(StoreKeys.Swap),
  (reducerState) =>
    reducerState.loading ||
    !reducerState.baseTokenAddress ||
    !reducerState.quoteTokenAddress,
)

export const swapSelectors = {
  swap,
  swapReady,
  swapLoading,
  isSingleSwapThroughLinear,
  isSwapInProgress,
  swapTokensAddresses,
  quotePrice,
  slippage,
  baseTokenValue,
  swapDisabled,
  disabledSwapIcon,
}
