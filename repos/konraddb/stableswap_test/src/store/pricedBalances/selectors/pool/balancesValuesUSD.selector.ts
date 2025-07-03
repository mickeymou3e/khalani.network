import { Address } from '@interfaces/data'
import { IPool } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import { createSelector } from '@reduxjs/toolkit'
import { balancesSelectors } from '@store/balances/selectors/balances.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { CompositionType, IPoolModel } from '@store/pool/selectors/models/types'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { IBalance } from '@store/pricedBalances/pricedBalances.types'
import { balancesValuesUSDSelectors } from '@store/pricedBalances/selectors/balancesValuesUSD.selector'
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
  ) => {
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
            }
          } else if (block.type === CompositionType.POOL) {
            const nestedPoolModel = block.value as IPoolModel

            const nestedPool = selectPoolById(nestedPoolModel.id)
            const nestedPoolValueUSD = nestedPoolModel?.tokens.reduce(
              (nestedPoolValueUSD, token) => {
                const valueUSD =
                  selectTokenValueUSD(nestedPoolModel.address, token.address) ??
                  BigDecimal.from(0)

                return nestedPoolValueUSD.add(valueUSD)
              },
              BigDecimal.from(0),
            )

            const poolShare =
              selectTokenBalance(poolModel.address, nestedPoolModel.address) ??
              BigDecimal.from(0)

            const scaleFactor = nestedPool?.totalShares
              ? poolShare.div(nestedPool.totalShares)
              : BigDecimal.from(0)

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
  (selectPoolValuesUSD, selectTokenBalance, selectPoolById) => {
    return (address: Address, poolId: IPool['id']) => {
      const pool = selectPoolById(poolId)
      if (pool) {
        const totalPoolValuesUSD = selectPoolValuesUSD(poolId)
        const poolShare = selectTokenBalance(address, pool.address)
        const totalPoolShare = pool.totalShares

        if (poolShare && totalPoolShare) {
          const scaleFactor = poolShare.div(totalPoolShare)

          const poolValuesUSD =
            totalPoolValuesUSD &&
            Object.keys(totalPoolValuesUSD).reduce(
              (poolBalances, tokenAddress) => ({
                ...poolBalances,
                [tokenAddress]:
                  tokenAddress && totalPoolValuesUSD[tokenAddress]
                    ? totalPoolValuesUSD[tokenAddress]?.mul(scaleFactor)
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
  ],
  (
    selectTokenValueUSD,
    selectTokenBalance,
    selectPoolModelById,
    selectPoolById,
  ) => {
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
                  nestedPoolValuesUSD[token.address] ?? BigDecimal.from(0)

                // TODO: should be behavior of linear pool
                if (isDebtToken(token.address)) {
                  const underlyingToken = getDebtUnderlying(token.address)
                  const prevUnderlyingValueUSD =
                    nestedPoolValuesUSD[underlyingToken]

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
                }
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
              Object.keys(nestedPoolValuesUSD).reduce((valuesUSD, token) => {
                const nestedPoolValueUSD = nestedPoolValuesUSD[token]

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
    return (address: Address, poolId: IPool['id']) => {
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
                [tokenAddress]: totalPoolUnderlyingValuesUSD[tokenAddress]
                  ? totalPoolUnderlyingValuesUSD[tokenAddress]?.mul(scaleFactor)
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

export const poolBalancesValuesUSDSelectors = {
  selectPoolValuesUSD,
  selectPoolValuesUSDByAddress,
  selectPoolUnderlyingValuesUSD,
  selectPoolUnderlyingValuesUSDByAddress,
}
