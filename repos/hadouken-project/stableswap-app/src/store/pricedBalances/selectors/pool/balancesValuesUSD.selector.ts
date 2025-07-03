import { IPool } from '@interfaces/pool'
import { Balances, IToken } from '@interfaces/token'
import { createSelector } from '@reduxjs/toolkit'
import { balancesSelectors } from '@store/balances/selectors/balances.selector'
import { networkSelectors } from '@store/network/network.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { CompositionType, IPoolModel } from '@store/pool/selectors/models/types'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { IBalance } from '@store/pricedBalances/pricedBalances.types'
import { balancesValuesUSDSelectors } from '@store/pricedBalances/selectors/token/balancesValuesUSD.selector'
import { BigDecimal } from '@utils/math'
import { getDebtUnderlying, isDebtToken } from '@utils/token'

/*
  Selecting pool values of in-pool tokens
  Ex.:
  selectPoolValuesUSD(Pool X (Token  A , Token B))
    -> {
          [Token A]: ValueUSD A,
          [Token B]: ValueUSD B
        }
   selectPoolValuesUSD(Pool X (Pool Y(TokenYA, TokenYB) , Token B))
    -> {
          [Pool Y]: ValueUSD Y,
          [Token B]: ValueUSD B
        }
 */
const selectPoolValuesUSD = createSelector(
  [
    balancesValuesUSDSelectors.selectTokenValueUSD,
    balancesSelectors.selectTokenBalance,
    poolsModelsSelector.selectById,
    poolSelectors.selectById,
  ],
  (
    selectTokenValueUSD,
    selectTokenBalance,
    selectPoolModelById,
    selectPoolById,
  ): ((poolId: IPool['id']) => Partial<Balances>) => {
    return (poolId: IPool['id']) => {
      const poolModel = selectPoolModelById(poolId)

      const poolBlockValuesUSD = poolModel?.compositionBlocks.reduce(
        (blockBalance, block) => {
          if (block.type === CompositionType.TOKEN) {
            const token = block.value as IToken
            const valueUSD = selectTokenValueUSD(
              poolModel.address,
              token.address,
            )

            return {
              ...blockBalance,
              [token.address]: valueUSD,
            } as Balances
          } else if (block.type === CompositionType.POOL) {
            const nestedPoolModel = block.value as IPoolModel

            const nestedPool = selectPoolById(nestedPoolModel.id)

            const poolShare =
              selectTokenBalance(poolModel.address, nestedPoolModel.address) ??
              BigDecimal.from(0)
            const scaleFactor = nestedPool?.totalShares
              ? poolShare.div(nestedPool.totalShares)
              : BigDecimal.from(0)

            const nestedPoolValueUSD = nestedPoolModel?.compositionBlocks.reduce(
              (nestedPoolValueUSD, block) => {
                if (block.type === CompositionType.POOL) {
                  const nested2PoolModel = block.value as IPoolModel

                  const poolShare = selectTokenBalance(
                    nestedPoolModel.address,
                    nested2PoolModel.address,
                  )
                  const totalPoolShare = nested2PoolModel.pool.totalShares

                  const scaleFactor = poolShare?.div(totalPoolShare)
                  const nestedPool2ValueUSD = nested2PoolModel?.tokens.reduce(
                    (nestedPoolValueUSD, token) => {
                      const valueUSD =
                        selectTokenValueUSD(
                          nested2PoolModel.address,
                          token.address,
                        ) ?? BigDecimal.from(0)

                      return nestedPoolValueUSD.add(
                        scaleFactor ? valueUSD.mul(scaleFactor) : valueUSD,
                      )
                    },
                    BigDecimal.from(0),
                  )

                  return nestedPoolValueUSD.add(nestedPool2ValueUSD)
                } else {
                  const token = block.value as IToken
                  const valueUSD =
                    selectTokenValueUSD(
                      nestedPoolModel.address,
                      token.address,
                    ) ?? BigDecimal.from(0)

                  return nestedPoolValueUSD.add(valueUSD)
                }
              },
              BigDecimal.from(0),
            )

            const valueUSD =
              nestedPool?.totalShares && nestedPoolValueUSD.mul(scaleFactor)

            return {
              ...blockBalance,
              [nestedPoolModel.address]: valueUSD,
            }
          }
        },
        {} as IBalance['balances'],
      )

      return poolBlockValuesUSD
    }
  },
)

const selectPoolValuesUSDByAddress = createSelector(
  [
    selectPoolValuesUSD,
    balancesSelectors.selectTokenBalance,
    poolSelectors.selectById,
  ],
  (
    selectPoolValuesUSD,
    selectTokenBalance,
    selectPoolById,
  ): ((walletAddress: string, poolId: IPool['id']) => Balances) => {
    return (walletAddress: string, poolId: IPool['id']) => {
      const pool = selectPoolById(poolId)

      if (pool) {
        const totalPoolValuesUSD = selectPoolValuesUSD(poolId)

        const poolShare = selectTokenBalance(walletAddress, pool.address)
        const totalPoolShare = pool.totalShares

        if (poolShare && totalPoolShare) {
          const scaleFactor = poolShare.div(totalPoolShare)

          const poolValuesUSD =
            totalPoolValuesUSD &&
            Object.keys(totalPoolValuesUSD).reduce(
              (poolBalances, tokenAddress) =>
                ({
                  ...poolBalances,
                  [tokenAddress]:
                    tokenAddress && totalPoolValuesUSD?.[tokenAddress]
                      ? totalPoolValuesUSD[tokenAddress]?.mul(scaleFactor)
                      : BigDecimal.from(0),
                } as Balances),
              {} as IBalance['balances'],
            )

          return poolValuesUSD as Balances
        }
      }
    }
  },
)

/*
  Selecting pool values of underlying tokens
  Ex.:
  selectPoolValuesUSD(Pool X (Token  A , Token B))
    -> {
          [Token A]: ValueUSD A,
          [Token B]: ValueUSD B
        }
  selectPoolValuesUSD(Pool X (Pool Y(TokenYA, TokenYB) , Token B))
    -> {
          [Token YA]: ValueUSD YA,
          [Token YB]: ValueUSD YB,
          [Token B]: ValueUSD B
        }
 */
const selectPoolUnderlyingValuesUSD = createSelector(
  [
    balancesValuesUSDSelectors.selectTokenValueUSD,
    balancesSelectors.selectTokenBalance,
    poolsModelsSelector.selectById,
    poolSelectors.selectById,
    networkSelectors.applicationChainId,
  ],
  (
    selectTokenValueUSD,
    selectTokenBalance,
    selectPoolModelById,
    selectPoolById,
    chainId,
  ): ((poolId: string) => Balances) => {
    return (poolId: IPool['id']) => {
      const poolModel = selectPoolModelById(poolId)

      const poolBlockValuesUSD = poolModel?.compositionBlocks.reduce(
        (blockBalance, block) => {
          if (block.type === CompositionType.TOKEN) {
            const token = block.value as IToken
            const valueUSD = selectTokenValueUSD(
              poolModel.address,
              token.address,
            )

            if (blockBalance) {
              return {
                ...blockBalance,
                [token.address]: valueUSD,
              } as Balances
            } else {
              return {
                [token.address]: valueUSD,
              } as Balances
            }
          } else if (block.type === CompositionType.POOL) {
            const nestedPoolModel = block.value as IPoolModel

            const nestedPool = selectPoolById(nestedPoolModel.id)
            const nestedPoolValuesUSD = nestedPoolModel?.tokens.reduce(
              (nestedPoolValuesUSD, token) => {
                const valueUSD =
                  selectTokenValueUSD(nestedPoolModel.address, token.address) ??
                  BigDecimal.from(0)

                const prevValueUSD =
                  nestedPoolValuesUSD?.[token.address] ?? BigDecimal.from(0)

                // TODO: should be behavior of linear pool
                if (isDebtToken(token.address, chainId)) {
                  const underlyingToken = getDebtUnderlying(
                    token.address,
                    chainId,
                  ) as string
                  const prevUnderlyingValueUSD =
                    nestedPoolValuesUSD?.[underlyingToken]

                  return {
                    ...nestedPoolValuesUSD,
                    [underlyingToken]: prevUnderlyingValueUSD
                      ? prevUnderlyingValueUSD.add(valueUSD)
                      : valueUSD,
                  }
                }
                return {
                  ...nestedPoolValuesUSD,
                  [token.address]: prevValueUSD
                    ? valueUSD.add(prevValueUSD)
                    : valueUSD,
                } as Balances
              },
              {} as IBalance['balances'],
            )

            const poolShare =
              selectTokenBalance(poolModel.address, nestedPoolModel.address) ??
              BigDecimal.from(0)

            const scaleFactor = nestedPool?.totalShares
              ? poolShare.div(nestedPool.totalShares)
              : BigDecimal.from(0)

            const poolValuesUSD =
              nestedPool?.totalShares &&
              nestedPoolValuesUSD &&
              Object.keys(nestedPoolValuesUSD).reduce((valuesUSD, token) => {
                const nestedPoolValueUSD = nestedPoolValuesUSD?.[token]

                return {
                  ...valuesUSD,
                  [token]: nestedPoolValueUSD?.mul(scaleFactor),
                }
              }, {} as IBalance['balances'])

            return {
              ...blockBalance,
              ...poolValuesUSD,
            }
          }
        },
        {} as IBalance['balances'],
      )

      return poolBlockValuesUSD
    }
  },
)

const selectPoolUnderlyingValuesUSDByAddress = createSelector(
  [
    selectPoolUnderlyingValuesUSD,
    balancesSelectors.selectTokenBalance,
    poolSelectors.selectById,
  ],
  (selectPoolUnderlyingValuesUSD, selectTokenBalance, selectPoolById) => {
    return (address: string, poolId: IPool['id']) => {
      const pool = selectPoolById(poolId)
      if (pool) {
        const totalPoolUnderlyingValuesUSD = selectPoolUnderlyingValuesUSD(
          poolId,
        )
        const poolShare = selectTokenBalance(address, pool.address)
        const totalPoolShare = pool.totalShares

        if (poolShare && totalPoolShare) {
          const scaleFactor = poolShare.div(totalPoolShare)

          const poolValuesUSD =
            totalPoolUnderlyingValuesUSD &&
            Object.keys(totalPoolUnderlyingValuesUSD).reduce(
              (poolBalances, tokenAddress) => ({
                ...poolBalances,
                [tokenAddress]: totalPoolUnderlyingValuesUSD?.[tokenAddress]
                  ? totalPoolUnderlyingValuesUSD?.[tokenAddress]?.mul(
                      scaleFactor,
                    )
                  : BigDecimal.from(0),
              }),
              {} as IBalance['balances'],
            )

          return poolValuesUSD
        }
      }
    }
  },
)

const selectScaleFactor = createSelector(
  [balancesSelectors.selectTokenBalance, poolsModelsSelector.selectById],
  (selectTokenBalance, selectPoolModelById) => {
    return (poolId: string, nestedPoolModelId: string) => {
      const poolModel = selectPoolModelById(poolId)
      const nestedPoolModel = selectPoolModelById(nestedPoolModelId)

      if (poolModel && nestedPoolModel) {
        const poolShare =
          selectTokenBalance(poolModel.address, nestedPoolModel.address) ??
          BigDecimal.from(0)

        const scaleFactor = poolShare.div(nestedPoolModel.pool.totalShares)

        return scaleFactor
      }

      return BigDecimal.fromString('1')
    }
  },
)

export const poolBalancesValuesUSDSelectors = {
  selectPoolValuesUSD,
  selectPoolValuesUSDByAddress,
  selectPoolUnderlyingValuesUSD,
  selectPoolUnderlyingValuesUSDByAddress,
  selectScaleFactor,
}
