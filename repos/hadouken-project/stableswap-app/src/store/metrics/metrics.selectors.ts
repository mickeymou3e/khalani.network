import { BigNumber } from 'ethers'
import { flatten } from 'lodash'

import { BOOSTED_POOLS_SYMBOL_LOWER_CASE } from '@components/PoolTable/PoolTable.constants'
import { getTokens } from '@dataSource/graph/pools/poolsTokens/constants'
import { address } from '@dataSource/graph/utils/formatters'
import { IPool, PoolType } from '@interfaces/pool'
import { Balances, IToken } from '@interfaces/token'
import { createSelector } from '@reduxjs/toolkit'
import { balancesSelectors } from '@store/balances/selectors/balances.selector'
import { poolBalancesSelectors } from '@store/balances/selectors/pool/balances.selector'
import { lendingSelectors } from '@store/lending/lending.selector'
import { ILendingReserve } from '@store/lending/lending.types'
import { networkSelectors } from '@store/network/network.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { CompositionType, IPoolModel } from '@store/pool/selectors/models/types'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { poolHistorySelectors } from '@store/poolHistory/selectors/poolHistory.selector'
import { pricedBalancesSelectors } from '@store/pricedBalances/selectors/priceBalances.selector'
import { WEEK_BIG_DECIMAL, YEAR_BIG_DECIMAL } from '@utils/date'
import { BigDecimal } from '@utils/math'

const selectPoolTotalValueUSD = createSelector(
  [pricedBalancesSelectors.selectPoolValuesUSD],
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

const selectPoolVolume7dUSD = createSelector(
  [poolSelectors.selectById, poolHistorySelectors.selectById],
  (selectPool, selectPool7d) => {
    return (poolId: IPool['id']) => {
      const pool = selectPool(poolId)
      const pool7d = selectPool7d(poolId)

      if (pool) {
        const volume7d = pool.totalSwapVolume.sub(
          pool7d?.totalSwapVolume ?? BigDecimal.from(0),
        )

        return volume7d
      }

      return BigDecimal.from(0)
    }
  },
)

const selectPoolSwapFee7dUSD = createSelector(
  [poolSelectors.selectById, poolHistorySelectors.selectById],
  (selectPool, selectPool7d) => {
    return (poolId: IPool['id']) => {
      const pool = selectPool(poolId)
      const pool7d = selectPool7d(poolId)

      if (pool) {
        const totalSwapFee7d = pool.totalSwapFee.sub(
          pool7d?.totalSwapFee ?? BigDecimal.from(0),
        )

        return totalSwapFee7d
      }
      return BigDecimal.from(0)
    }
  },
)

const getPoolTokenBalances = (
  poolId: string,
  poolModel: IPoolModel,

  selectBalanceForToken: (
    address: string,
    tokenIds?: string[],
  ) => Partial<Balances>,

  selectBalanceForPool: (
    walletAddress: string,
    poolId: string,
  ) => Partial<Balances>,

  selectScaleFactor: (poolId: string, nestPoolModelId: string) => BigDecimal,
  inUSD: boolean,
) => {
  return poolModel.compositionBlocks.reduce((data, compositionBlock) => {
    if (compositionBlock.type === CompositionType.TOKEN) {
      const scaleFactor =
        poolId === poolModel.id
          ? BigDecimal.from(1, 0)
          : selectScaleFactor(poolId, poolModel.id)

      const token = compositionBlock.value as IToken
      const balances = poolModel
        ? selectBalanceForToken(inUSD ? poolModel.id : poolModel.address, [
            token.address,
          ])
        : null

      const balance =
        balances?.[token.address]?.mul(scaleFactor) ?? BigDecimal.from(0)

      return {
        ...data,
        [compositionBlock.value.address]: balance,
      }
    } else if (compositionBlock.type === CompositionType.POOL) {
      const nestedPoolModel = compositionBlock.value as IPoolModel

      const scaleFactor = selectScaleFactor(poolId, nestedPoolModel.id)

      const subTokens = getPoolTokenBalances(
        poolId,
        nestedPoolModel,
        selectBalanceForToken,
        selectBalanceForPool,
        () => scaleFactor,
        inUSD,
      )

      data = {
        ...data,
        ...subTokens,
        [nestedPoolModel.address]: nestedPoolModel.pool.totalShares.mul(
          scaleFactor,
        ),
      }

      return data
    }
  }, {} as { [key: string]: BigDecimal })
}

const selectPoolBalances = createSelector(
  [
    poolsModelsSelector.selectById,
    balancesSelectors.selectTokensBalances,
    poolBalancesSelectors.selectPoolBalancesByAddress,
    pricedBalancesSelectors.selectScaleFactor,
  ],
  (
    selectPoolModel,
    selectTokensBalances,
    selectPoolBalancesByAddress,
    selectScaleFactor,
  ) => {
    return (poolId: IPool['id']) => {
      const poolModel = selectPoolModel(poolId)
      if (!poolModel) {
        return {}
      }

      return getPoolTokenBalances(
        poolId,
        poolModel,
        selectTokensBalances,
        selectPoolBalancesByAddress,
        selectScaleFactor,
        false,
      )
    }
  },
)

const selectPoolBalancesUSD = createSelector(
  [
    poolsModelsSelector.selectById,
    pricedBalancesSelectors.selectPoolValuesUSD,
    pricedBalancesSelectors.selectPoolValuesUSDByAddress,
    pricedBalancesSelectors.selectScaleFactor,
  ],
  (
    selectPoolModel,
    selectPoolValuesUSD,
    selectPoolValuesUSDByAddress,
    selectScaleFactor,
  ) => {
    return (poolId: IPool['id']) => {
      const poolModel = selectPoolModel(poolId)
      if (!poolModel) {
        return {} as Balances
      }

      return getPoolTokenBalances(
        poolId,
        poolModel,
        (id, _tokens) => selectPoolValuesUSD(id),
        selectPoolValuesUSDByAddress,
        selectScaleFactor,
        true,
      )
    }
  },
)

const hundredPercentage = BigDecimal.from(BigNumber.from(10).pow(25), 25)

const getLendingPoolWrappedHTokenBalances = (
  aavePools: IPool[],
  currentPool: IPool | undefined,
  selectPoolBalancesByAddress: (
    address: string,
    poolId: string,
  ) => { [key: string]: BigDecimal | null | undefined } | null | undefined,
) => {
  return aavePools.reduce((balances, pool) => {
    const poolValue = selectPoolBalancesByAddress?.(
      currentPool?.address ?? '',
      pool.id,
    )

    return {
      ...balances,
      ...poolValue,
    }
  }, {} as { [key: string]: BigDecimal | null | undefined })
}

const calculateLendingApy = (
  apyTokens: ILendingReserve[],
  yieldFee: BigDecimal,
  totalLiquidity: BigDecimal,
  tokenBalances: Partial<{
    [key: string]: BigDecimal | null
  }>,
  chainId: string,
) => {
  return apyTokens.reduce((apy, token) => {
    if (token.APY) {
      const yieldFeePercentage = hundredPercentage.sub(yieldFee)
      const apyWithYield = token.APY.mul(yieldFeePercentage)

      const weight = getTokenWeight(
        totalLiquidity,
        tokenBalances,
        token.aTokenAddress,
        chainId,
      )

      apy = apy.add(apyWithYield.mul(weight))
    }

    return apy
  }, BigDecimal.from(0, 27))
}

const getTokenWeight = (
  totalLiquidity: BigDecimal,
  balances: Partial<{
    [key: string]: BigDecimal | null
  }>,
  tokenAddress: string,
  chainId: string,
): BigDecimal => {
  const tokenConfig = getTokens(chainId).find(
    (config) =>
      address(config.unwrappedAddress ?? '') === address(tokenAddress),
  )
  const wrappedHTokenAddress = address(tokenConfig?.address ?? '')

  if (wrappedHTokenAddress) {
    const balance = balances[wrappedHTokenAddress]

    const balanceInNumber = balance?.toNumber() ?? 0
    const totalLiquidityInNumber = totalLiquidity?.toNumber() ?? 0

    const weight =
      balance && balanceInNumber > 0 && totalLiquidityInNumber > 0
        ? balance?.div(totalLiquidity)
        : BigDecimal.from(0, 27)

    return weight
  }

  return BigDecimal.from(0, 27)
}

const selectPoolAPR = createSelector(
  [
    lendingSelectors.selectAllReserves,
    lendingSelectors.yieldFee,
    poolSelectors.selectAll,
    selectPoolTotalValueUSD,
    selectPoolSwapFee7dUSD,
    poolBalancesSelectors.selectPoolBalancesByAddress,
    pricedBalancesSelectors.selectScaleFactor,
    networkSelectors.applicationChainId,
  ],
  (
    aaveApyTokens,
    yieldFee,
    allPools,
    selectPoolTotalValueUSD,
    selectPoolSwapFee7dUSD,
    selectPoolBalancesByAddress,
    selectScaleFactor,
    chainId,
  ) => {
    return (poolId: IPool['id'], feePercentage: BigDecimal) => {
      const totalLiquidity = selectPoolTotalValueUSD(poolId)
      const totalSwapFee7d = selectPoolSwapFee7dUSD(poolId)

      const poolFee = BigDecimal.from(1, 0).sub(feePercentage)

      const apr = totalSwapFee7d
        .div(WEEK_BIG_DECIMAL)
        .mul(poolFee)
        .mul(YEAR_BIG_DECIMAL)
        .div(totalLiquidity)
        .mul(BigDecimal.from(100, 0))

      const aavePools = allPools.filter(
        (pool) => pool.poolType === PoolType.AaveLinear,
      )

      const currentPool = allPools.find(
        (pool) => pool.id.toLowerCase() === poolId.toLowerCase(),
      )

      const currentPoolAavePools = currentPool
        ? currentPool.tokens.reduce<IPool[]>((allLinearPools, poolToken) => {
            const pool = allPools.find(
              (pool) => pool.address === poolToken.address,
            )

            if (
              pool &&
              currentPool.address !== pool.address &&
              (pool.poolType === PoolType.AaveLinear ||
                BOOSTED_POOLS_SYMBOL_LOWER_CASE.includes(
                  pool.symbol.toLowerCase(),
                ))
            ) {
              allLinearPools.push(pool)

              return allLinearPools
            }

            return allLinearPools
          }, [])
        : []

      if (currentPoolAavePools && currentPoolAavePools.length > 0) {
        const boostedPool = currentPoolAavePools.find((pool) =>
          BOOSTED_POOLS_SYMBOL_LOWER_CASE.includes(pool.symbol.toLowerCase()),
        )

        const allLinearPoolsForCurrentPool = currentPoolAavePools.reduce<{
          boosted: IPool[]
          linear: IPool[]
        }>(
          (pool, poolToken) => {
            if (
              BOOSTED_POOLS_SYMBOL_LOWER_CASE.includes(
                poolToken.symbol.toLowerCase(),
              )
            ) {
              poolToken.tokens.forEach((token) => {
                const nestedAavePool = aavePools.find(
                  (aavePool) => aavePool.address === token.address,
                )

                if (nestedAavePool) {
                  pool.boosted.push(nestedAavePool)
                }
              })

              return pool
            }

            pool.linear.push(poolToken)

            return pool
          },
          { boosted: [], linear: [] },
        )

        const AavePoolTokens = flatten(
          [
            ...allLinearPoolsForCurrentPool.boosted,
            ...allLinearPoolsForCurrentPool.linear,
          ].map((aavePool) => aavePool.tokens),
        )

        const linearWrappedHTokenBalances = getLendingPoolWrappedHTokenBalances(
          allLinearPoolsForCurrentPool.linear,
          currentPool,
          selectPoolBalancesByAddress,
        )

        const scaleFactor = selectScaleFactor(
          currentPool?.id ?? '',
          boostedPool?.id ?? '',
        )

        const nestedLinearWrappedHTokenBalances = Object.entries(
          getLendingPoolWrappedHTokenBalances(
            allLinearPoolsForCurrentPool.boosted,
            boostedPool,
            selectPoolBalancesByAddress,
          ),
        ).reduce<{ [key: string]: BigDecimal | null | undefined }>(
          (total, [key, value]) => {
            total[key] = value?.mul(scaleFactor)

            return total
          },
          {},
        )

        const apyTokens = aaveApyTokens.filter((token) =>
          AavePoolTokens.some(
            (aavePoolToken) =>
              address(aavePoolToken.address) ===
              address(token.wrappedATokenAddress),
          ),
        )

        const lendingApy = calculateLendingApy(
          apyTokens,
          yieldFee,
          totalLiquidity,
          {
            ...linearWrappedHTokenBalances,
            ...nestedLinearWrappedHTokenBalances,
          },
          chainId,
        )

        return {
          lendingApr: lendingApy,
          swapApr: apr,
          totalApr: apr.add(lendingApy),
        }
      }

      return {
        totalApr: apr,
      }
    }
  },
)

export const metricsSelectors = {
  selectPoolTotalValueUSD,
  selectPoolVolume7dUSD,
  selectPoolSwapFee7dUSD,
  selectPoolAPR,
  selectPoolBalances,
  selectPoolBalancesUSD,
}
