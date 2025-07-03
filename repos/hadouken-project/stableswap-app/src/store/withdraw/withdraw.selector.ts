import { BigNumber } from 'ethers'

import { PROPORTIONAL_TOKEN } from '@containers/pools/WithdrawContainer/WithdrawContainer.constants'
import { address } from '@dataSource/graph/utils/formatters'
import { PoolType } from '@interfaces/pool'
import { createSelector } from '@reduxjs/toolkit'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { pricesSelector } from '@store/prices/prices.selector'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'
import { userSharesSelectors } from '@store/userShares/userShares.selector'
import { IWithdraw } from '@store/withdraw/withdraw.types'
import { BigDecimal } from '@utils/math'

const withdraw = createSelector(
  [selectReducer(StoreKeys.Withdraw)],
  (reducerState) =>
    ({
      poolId: reducerState?.poolId,

      inToken: reducerState?.inToken,
      inTokenAmount: reducerState?.inTokenAmount,

      outTokens: reducerState?.outTokens,
      outTokensAmounts: reducerState?.outTokensAmounts,

      type: reducerState?.type,

      slippage: reducerState?.slippage,

      tokensMaxBalance: reducerState.tokensMaxBalance,

      isMaxAmount: reducerState.isMaxAmount,
      tokenIndex: reducerState.tokenIndex,
    } as IWithdraw),
)

const withdrawReady = createSelector(
  [selectReducer(StoreKeys.Withdraw)],
  (reduceState) => !!reduceState,
)

const withdrawInProgress = createSelector(
  [selectReducer(StoreKeys.Withdraw)],
  (reduceState) => reduceState.withdrawInProgress,
)

const withdrawLoading = createSelector(
  [selectReducer(StoreKeys.Withdraw)],
  (reducerState) => reducerState?.loading,
)

const withdrawTokensMaxBalance = createSelector(
  [selectReducer(StoreKeys.Withdraw)],
  (reducerState) => reducerState.tokensMaxBalance,
)

const draggingSlider = createSelector(
  [selectReducer(StoreKeys.Withdraw)],
  (reducerState) => reducerState.draggingSlider,
)

const isFetchingComposableProportions = createSelector(
  [selectReducer(StoreKeys.Withdraw)],
  (reducerState) => reducerState.isFetchingComposableProportions,
)

const composablePoolProportionalBalances = createSelector(
  [selectReducer(StoreKeys.Withdraw)],
  (reducerState) => reducerState.composablePoolProportionalBalances,
)

const displayImbalanceComposablePoolWithSignificantUserHoldingBanner = createSelector(
  [selectReducer(StoreKeys.Withdraw)],
  (reducerState) =>
    reducerState.displayImbalanceComposablePoolWithSignificantUserHoldingBanner,
)

const withdrawEditor = createSelector(
  [selectReducer(StoreKeys.Withdraw)],
  (reducerState) => reducerState,
)

const isProportionalWithdraw = createSelector(
  [selectReducer(StoreKeys.Withdraw)],
  (reducerState) => {
    return reducerState.selectedToken?.symbol === PROPORTIONAL_TOKEN.symbol
  },
)

const isMaxAmount = createSelector(
  [selectReducer(StoreKeys.Withdraw), isProportionalWithdraw],
  (reducerState, isProportionalWithdraw) => {
    if (
      reducerState.tokensMaxBalance &&
      reducerState.selectedToken &&
      !isProportionalWithdraw &&
      !reducerState.isUserShareGreaterThanMaximumShare
    ) {
      return reducerState.withdrawAmount
        .toBigNumber()
        .eq(
          reducerState.tokensMaxBalance?.[reducerState.selectedToken.address] ??
            BigNumber.from(0),
        )
    }

    return false
  },
)

const withdrawAmountExceedsBalance = createSelector(
  [selectReducer(StoreKeys.Withdraw)],
  (reducerState) => {
    return reducerState.withdrawAmount.gt(
      BigDecimal.from(
        reducerState.selectedToken?.balance ?? BigNumber.from(0),
        reducerState.selectedToken?.decimals,
      ),
    )
  },
)

const isCalculatingPreview = createSelector(
  [selectReducer(StoreKeys.Withdraw), userSharesSelectors.isFetching],
  (reducerState, isFetchingUserShares) => {
    return (
      reducerState.draggingSlider ||
      reducerState.isFetchingComposableProportions ||
      isFetchingUserShares ||
      !reducerState.isInitialized
    )
  },
)

const withdrawSingleTokenValueUSD = createSelector(
  [selectReducer(StoreKeys.Withdraw), pricesSelector.selectById],
  (reducerState, selectTokenPrice) => {
    const selectedTokenPrice =
      reducerState.selectedToken &&
      selectTokenPrice(reducerState.selectedToken.address)

    const singleTokenWithdrawValueUSD =
      selectedTokenPrice?.price.mul(reducerState.withdrawAmount) ??
      BigDecimal.from(0)

    return singleTokenWithdrawValueUSD
  },
)
const withdrawProportionalValueUSD = createSelector(
  [
    selectReducer(StoreKeys.Withdraw),
    userSharesSelectors.depositTokenBalances,
    pricesSelector.selectById,
    poolsModelsSelector.selectById,
  ],
  (reducerState, depositTokensBalances, selectTokenPrice, selectPoolModel) => {
    const poolModel = selectPoolModel(reducerState.poolId ?? '')

    if (poolModel) {
      if (poolModel.pool.poolType === PoolType.ComposableStable) {
        const withdrawProportionalComposableTotalValueUSD = Object.entries(
          reducerState.composablePoolProportionalBalances,
        ).reduce((total, [address, value]) => {
          const price = selectTokenPrice(address)

          if (price && value) {
            const tokenBalanceInUSD = value.mul(price.price)

            return total.add(tokenBalanceInUSD)
          }

          return total
        }, BigDecimal.from(0))

        return withdrawProportionalComposableTotalValueUSD
      } else {
        const depositTokenBalanceForPool =
          depositTokensBalances[address(poolModel.pool.address ?? '')]

        if (depositTokenBalanceForPool) {
          const weightedProportionalTotalUSD = Object.entries(
            depositTokenBalanceForPool,
          ).reduce((total, [address, value]) => {
            const price = selectTokenPrice(address)

            if (price && value) {
              const tokenBalanceInUSD = value
                .mul(BigDecimal.from(reducerState.percentage, 2))
                .mul(price.price)

              return total.add(tokenBalanceInUSD)
            }

            return total
          }, BigDecimal.from(0))

          return weightedProportionalTotalUSD
        } else {
          return BigDecimal.from(0)
        }
      }
    }

    return BigDecimal.from(0)
  },
)

const withdrawTotalValueUSD = createSelector(
  [
    withdrawProportionalValueUSD,
    withdrawSingleTokenValueUSD,
    isProportionalWithdraw,
  ],
  (
    withdrawProportionalValueUSD,
    withdrawSingleTokenValueUSD,
    isProportional,
  ) => {
    return isProportional
      ? withdrawProportionalValueUSD
      : withdrawSingleTokenValueUSD
  },
)

export const withdrawSelectors = {
  withdraw,
  withdrawReady,
  withdrawLoading,
  withdrawInProgress,
  withdrawTokensMaxBalance,

  draggingSlider,
  isFetchingComposableProportions,
  composablePoolProportionalBalances,
  displayImbalanceComposablePoolWithSignificantUserHoldingBanner,
  isMaxAmount,
  isProportionalWithdraw,
  withdrawEditor,
  withdrawAmountExceedsBalance,
  isCalculatingPreview,
  withdrawTotalValueUSD,
}
