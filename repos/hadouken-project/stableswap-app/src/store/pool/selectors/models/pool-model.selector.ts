import { BOOSTED_POOLS_SYMBOL_LOWER_CASE } from '@components/PoolTable/PoolTable.constants'
import { address } from '@dataSource/graph/utils/formatters'
import { IPool, PoolType } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import { createSelector } from '@reduxjs/toolkit'
import { networkSelectors } from '@store/network/network.selector'
import { BasePoolBuilder } from '@store/pool/selectors/models/BasePool'
import { ComposableStablePoolBuilder } from '@store/pool/selectors/models/ComposableStablePool'
import { LinearPoolBuilder } from '@store/pool/selectors/models/LinearPool'
import {
  CompositionType,
  IPoolModel,
  IPoolModelBuilder,
  PoolWithSortedTokens,
} from '@store/pool/selectors/models/types'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { sortAssetsByBusinessOrder } from '@utils/token'

import { poolSelectors } from '../pool.selector'

function transformPoolToPoolModel({
  pool,
  pools,
  tokens,
  poolsModels,
  chainId,
}: {
  pool: IPool
  pools: IPool[]
  tokens: IToken[]
  poolsModels: IPoolModel[]
  chainId: string
}) {
  const updatedPoolsModels = [...poolsModels]
  const poolsAddresses = pools.map(({ address: poolAddress }) => poolAddress)

  let builder: IPoolModelBuilder
  if (ComposableStablePoolBuilder.approve(pool)) {
    builder = new ComposableStablePoolBuilder(pool, chainId)
  } else if (LinearPoolBuilder.approve(pool)) {
    builder = new LinearPoolBuilder(pool, chainId)
  } else {
    builder = new BasePoolBuilder(pool, chainId)
  }

  for (const token of pool.tokens) {
    if (pool.address === token.address) {
      continue
    }
    if (
      poolsAddresses
        .map((poolAddress) => address(poolAddress))
        .includes(address(token.address))
    ) {
      const nestedPoolModel = poolsModels.find(
        (poolModel) =>
          address(poolModel.pool.address) === address(token.address),
      )
      if (nestedPoolModel === undefined) {
        const nestedPool = pools.find(
          ({ address: poolAddress }) =>
            address(poolAddress) === address(token.address),
        )
        if (nestedPool) {
          const { poolsModels: updatedPoolsModels } = transformPoolToPoolModel({
            pool: nestedPool,
            pools,
            tokens,
            poolsModels,
            chainId,
          })
          const nestedPoolModel = updatedPoolsModels.find(
            (poolModel) =>
              address(poolModel.pool.address) === address(token.address),
          )

          if (nestedPoolModel) {
            updatedPoolsModels.push(nestedPoolModel)
            builder.addCompositionBlock({
              type: CompositionType.POOL,
              value: nestedPoolModel,
            })
          }
        }
      } else {
        builder.addCompositionBlock({
          type: CompositionType.POOL,
          value: nestedPoolModel,
        })
      }
    } else {
      builder.addCompositionBlock({
        type: CompositionType.TOKEN,
        value: token,
      })
    }
  }
  const poolModel = builder.build()
  updatedPoolsModels.push(poolModel)

  return {
    pool,
    pools,
    tokens,

    poolsModels: [...poolsModels, poolModel],
  }
}

const selectAll = createSelector(
  [
    poolSelectors.selectAll,
    tokenSelectors.selectAllTokens,
    networkSelectors.applicationChainId,
  ],
  (pools, tokens, chainId) => {
    const poolsModels =
      tokens?.length > 0
        ? pools?.reduce((poolsModels, pool) => {
            const {
              poolsModels: updatedPoolsModels,
            } = transformPoolToPoolModel({
              pool,
              pools,
              tokens,
              poolsModels,
              chainId,
            })

            return updatedPoolsModels
          }, [] as IPoolModel[])
        : []

    return poolsModels
  },
)

const selectById = createSelector([selectAll], (poolsModels) => {
  return (poolId: IPool['id']) => {
    return poolsModels?.find((poolModel) => poolModel.pool.id === poolId)
  }
})

const selectByAddress = createSelector([selectAll], (poolsModels) => {
  return (poolAddress: IPool['id']) => {
    return poolsModels.find(
      (poolModel) => poolModel.pool.address === poolAddress,
    )
  }
})

const isFetching = createSelector(
  [poolSelectors.isFetching, tokenSelectors.isFetching],
  (isFetchingPools, isFetchingTokens) => {
    return isFetchingPools || isFetchingTokens
  },
)

const selectPoolsWithSortedTokens = createSelector([selectAll], (poolsModels) =>
  poolsModels.reduce<PoolWithSortedTokens>((pools, poolModel) => {
    pools[poolModel.pool.id] = {
      name: poolModel.pool.displayName ?? poolModel.pool.name,
      tokens: poolModel.tokens
        .sort((tokenOne: IToken, tokenTwo: IToken) =>
          sortAssetsByBusinessOrder(tokenOne.symbol, tokenTwo.symbol),
        )
        .map((token) => ({
          id: token.id,
          symbol: token.symbol,
          source: token.source,
        })),
      symbol: poolModel.pool.symbol,
      displayPoolIcon:
        BOOSTED_POOLS_SYMBOL_LOWER_CASE.includes(
          poolModel.pool.symbol.toLowerCase(),
        ) ||
        poolModel.pool.poolType === PoolType.AaveLinear ||
        poolModel.pool.poolType === PoolType.Linear, // remove after redeploy new boosted pools
    }

    return pools
  }, {}),
)

export const poolsModelsSelector = {
  selectAll,
  selectById,
  isFetching,
  selectByAddress,
  selectPoolsWithSortedTokens,
}
