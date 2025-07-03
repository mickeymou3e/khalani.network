import { Address } from '@interfaces/data'
import { IPool } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import { createSelector } from '@reduxjs/toolkit'
import { balancesSelectors } from '@store/balances/selectors/balances.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { CompositionType, IPoolModel } from '@store/pool/selectors/models/types'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import {
  IBalance,
  IBalance as IBigDecimalBalance,
} from '@store/pricedBalances/pricedBalances.types'
import { BigDecimal } from '@utils/math'
import { getDebtUnderlying, isDebtToken } from '@utils/token'

const selectPoolBalances = createSelector(
  [balancesSelectors.selectTokensBalances, poolSelectors.selectById],
  (selectTokensBalances, selectPoolById) => {
    return (poolId: string) => {
      if (poolId) {
        const pool = selectPoolById(poolId)
        if (pool) {
          return selectTokensBalances(
            pool.address,
            pool.tokens.map(({ address }) => address),
          )
        }
      }

      return null
    }
  },
)

const selectPoolBalancesByAddress = createSelector(
  [
    balancesSelectors.selectTokenBalance,
    selectPoolBalances,
    poolSelectors.selectById,
  ],
  (selectTokenBalance, selectPoolBalances, selectPoolById) => (
    address: Address,
    poolId: IPool['id'],
  ) => {
    const pool = selectPoolById(poolId)
    const totalPoolBalances = selectPoolBalances(poolId)
    const poolShare = pool && selectTokenBalance(address, pool.address)
    const totalPoolShare = pool?.totalShares

    if (poolShare && totalPoolShare) {
      const scaleFactor = poolShare.div(totalPoolShare)

      const poolBalances =
        totalPoolBalances &&
        Object.keys(totalPoolBalances).reduce((poolBalances, tokenAddress) => {
          const totalTokenPoolBalance = totalPoolBalances[tokenAddress]
          return {
            ...poolBalances,
            [tokenAddress]: totalTokenPoolBalance?.mul(scaleFactor),
          }
        }, {} as IBalance['balances'])

      return poolBalances
    }
  },
)

const selectPoolUnderlyingBalances = createSelector(
  [
    selectPoolBalancesByAddress,
    balancesSelectors.selectTokenBalance,
    poolsModelsSelector.selectById,
    poolSelectors.selectById,
  ],
  (
    selectPoolBalancesByAddress,
    selectTokenBalance,
    selectPoolModelById,
    selectPoolById,
  ) => {
    return (poolId: IPool['id']) => {
      const poolModel = selectPoolModelById(poolId)

      const poolBlockBalance = poolModel?.compositionBlocks.reduce(
        (blockBalance, block) => {
          if (block.type === CompositionType.TOKEN) {
            const token = block.value as IToken
            const balance = selectTokenBalance(poolModel.address, token.address)

            return {
              ...blockBalance,
              [token.address]: balance ?? BigDecimal.from(0, token.decimals),
            }
          } else if (block.type === CompositionType.POOL) {
            const nestedPoolModel = block.value as IPoolModel
            const nestedPool = selectPoolById(nestedPoolModel.id)

            const nestedPoolBalances = nestedPoolModel?.tokens.reduce(
              (nestedPoolBalances, token) => {
                const balance =
                  selectTokenBalance(nestedPoolModel.address, token.address) ??
                  BigDecimal.from(0, token.decimals)

                const prevBalance = nestedPoolBalances[token.address]
                if (isDebtToken(token.address)) {
                  const underlyingToken = getDebtUnderlying(token.address)
                  const prevPoolBalance = nestedPoolBalances[underlyingToken]

                  return {
                    ...nestedPoolBalances,
                    [underlyingToken]: prevPoolBalance
                      ? prevPoolBalance.add(balance)
                      : balance,
                  }
                }
                return {
                  ...nestedPoolBalances,
                  [token.address]: prevBalance
                    ? balance?.add(prevBalance)
                    : balance,
                }
              },
              {} as IBigDecimalBalance['balances'],
            )
            const poolShare =
              selectTokenBalance(poolModel.address, nestedPoolModel.address) ??
              BigDecimal.from(0)

            const scaleFactor = nestedPool
              ? poolShare.div(nestedPool.totalShares)
              : BigDecimal.from(0)

            const poolBalances =
              nestedPool?.totalShares &&
              Object.keys(nestedPoolBalances).reduce((balances, token) => {
                const nestedPoolBalance = nestedPoolBalances[token]

                return {
                  ...balances,
                  [token]: nestedPoolBalance?.mul(scaleFactor),
                }
              }, {} as IBigDecimalBalance['balances'])

            return {
              ...blockBalance,
              ...poolBalances,
            }
          }
        },
        {} as IBigDecimalBalance['balances'],
      )

      return poolBlockBalance
    }
  },
)

const selectPoolUnderlyingBalancesByAddress = createSelector(
  [
    balancesSelectors.selectTokenBalance,
    selectPoolUnderlyingBalances,
    poolSelectors.selectById,
  ],
  (selectTokenBalance, selectPoolUnderlyingBalances, selectPoolById) => (
    address: Address,
    poolId: IPool['id'],
  ) => {
    const pool = selectPoolById(poolId)
    const totalPoolUnderlyingBalances = selectPoolUnderlyingBalances(poolId)
    const poolShare = pool && selectTokenBalance(address, pool.address)
    const totalPoolShare = pool?.totalShares

    if (poolShare && totalPoolShare) {
      const scaleFactor = poolShare.div(totalPoolShare)

      const poolUnderlyingBalances =
        totalPoolUnderlyingBalances &&
        Object.keys(totalPoolUnderlyingBalances).reduce(
          (poolBalances, tokenAddress) => ({
            ...poolBalances,
            [tokenAddress]: totalPoolUnderlyingBalances[tokenAddress]
              ? totalPoolUnderlyingBalances[tokenAddress]?.mul(scaleFactor)
              : BigDecimal.from(0),
          }),
          {} as IBigDecimalBalance['balances'],
        )

      return poolUnderlyingBalances
    }
  },
)

export const poolBalancesSelectors = {
  selectPoolBalances,
  selectPoolBalancesByAddress,
  selectPoolUnderlyingBalances,
  selectPoolUnderlyingBalancesByAddress,
}
