import { IPool } from '@interfaces/pool'
import { createSelector } from '@reduxjs/toolkit'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { poolSelectors as poolHistorySelectors } from '@store/poolHistory/selectors/poolHistory.selector'
import { poolBalancesValuesUSDSelectors } from '@store/pricedBalances/selectors/pool/balancesValuesUSD.selector'
import { BigDecimal } from '@utils/math'

const selectPoolTotalValueUSD = createSelector(
  [poolBalancesValuesUSDSelectors.selectPoolValuesUSD],
  (selectPoolValuesUSD) => {
    return (poolId: IPool['id']) => {
      const poolValuesUSD = selectPoolValuesUSD(poolId)

      return poolValuesUSD
        ? Object.keys(poolValuesUSD).reduce(
            (poolTotalValueUSD, tokenAddress) => {
              const poolTokenValueUSD = poolValuesUSD[tokenAddress]
              return poolTokenValueUSD
                ? poolTotalValueUSD.add(poolTokenValueUSD)
                : poolTotalValueUSD
            },
            BigDecimal.from(0),
          )
        : BigDecimal.from(0)
    }
  },
)

const selectPoolVolume24hUSD = createSelector(
  [poolSelectors.selectById, poolHistorySelectors.selectById],
  (selectPool, selectPool24h) => {
    return (poolId: IPool['id']) => {
      const pool = selectPool(poolId)
      const pool24h = selectPool24h(poolId)

      if (pool && pool24h) {
        const [totalSwapVolume, totalSwapVolume24h] = [
          pool.totalSwapVolume,
          pool24h.totalSwapVolume,
        ]

        const volume24h = totalSwapVolume.sub(totalSwapVolume24h)

        return volume24h
      }

      return BigDecimal.from(0)
    }
  },
)

const selectPoolSwapFee24hUSD = createSelector(
  [poolSelectors.selectById, poolHistorySelectors.selectById],
  (selectPool, selectPool24h) => {
    return (poolId: IPool['id']) => {
      const pool = selectPool(poolId)
      const pool24h = selectPool24h(poolId)

      if (pool && pool24h) {
        const totalSwapFee24h = pool.totalSwapFee.sub(pool24h.totalSwapFee)

        return totalSwapFee24h
      }
      return BigDecimal.from(0)
    }
  },
)

const selectPoolAPR = createSelector(
  [selectPoolTotalValueUSD, selectPoolSwapFee24hUSD],
  (selectPoolTotalValueUSD, selectPoolSwapFee24hUSD) => {
    return (poolId: IPool['id'], feePercentage: BigDecimal) => {
      const totalLiquidity = selectPoolTotalValueUSD(poolId)
      const totalSwapFee24h = selectPoolSwapFee24hUSD(poolId)

      const poolFee = BigDecimal.from(1, 0).sub(feePercentage)

      const apr = totalSwapFee24h
        .mul(poolFee)
        .div(totalLiquidity)
        .mul(BigDecimal.from(365, 0))

      return apr
    }
  },
)

export const metricsSelectors = {
  selectPoolTotalValueUSD,
  selectPoolVolume24hUSD,
  selectPoolSwapFee24hUSD,
  selectPoolAPR,
}
