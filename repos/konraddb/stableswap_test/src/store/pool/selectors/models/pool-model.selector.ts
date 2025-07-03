import { IPool } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import { createSelector } from '@reduxjs/toolkit'
import { BasePoolBuilder } from '@store/pool/selectors/models/BasePool'
import { ComposableStablePoolBuilder } from '@store/pool/selectors/models/ComposableStablePool'
import { LinearPoolBuilder } from '@store/pool/selectors/models/LinearPool'
import {
  CompositionType,
  IPoolModel,
  IPoolModelBuilder,
} from '@store/pool/selectors/models/types'
import { tokenSelectors } from '@store/tokens/tokens.selector'

import { poolSelectors } from '../pool.selector'

function transformPoolToPoolModel({
  pool,
  pools,
  tokens,
  poolsModels,
}: {
  pool: IPool
  pools: IPool[]
  tokens: IToken[]
  poolsModels: IPoolModel[]
}) {
  const updatedPoolsModels = [...poolsModels]
  const poolsAddresses = pools.map(({ address: poolAddress }) => poolAddress)

  let builder: IPoolModelBuilder
  if (ComposableStablePoolBuilder.approve(pool)) {
    builder = new ComposableStablePoolBuilder(pool)
  } else if (LinearPoolBuilder.approve(pool)) {
    builder = new LinearPoolBuilder(pool)
  } else {
    builder = new BasePoolBuilder(pool)
  }

  for (const token of pool.tokens) {
    if (pool.address === token.address) {
      continue
    }
    if (poolsAddresses.includes(token.address)) {
      const nestedPoolModel = poolsModels.find(
        (poolModel) => poolModel.pool.address === token.address,
      )
      if (nestedPoolModel === undefined) {
        const nestedPool = pools.find(
          ({ address }) => address === token.address,
        )
        if (nestedPool) {
          const { poolsModels: updatedPoolsModels } = transformPoolToPoolModel({
            pool: nestedPool,
            pools,
            tokens,
            poolsModels,
          })
          const nestedPoolModel = updatedPoolsModels.find(
            (poolModel) => poolModel.pool.address === token.address,
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
  [poolSelectors.selectAll, tokenSelectors.selectAllTokens],
  (pools, tokens) => {
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

const isFetching = createSelector(
  [poolSelectors.isFetching, tokenSelectors.isFetching],
  (isFetchingPools, isFetchingTokens) => {
    return isFetchingPools || isFetchingTokens
  },
)

export const poolsModelsSelector = { selectAll, selectById, isFetching }
