import uniqBy from 'lodash/uniqBy'

import { getPoolConfig } from '@dataSource/graph/pools/pools/constants'
import { address } from '@dataSource/graph/utils/formatters'
import { IPool, PoolType } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import { BasePool } from '@store/pool/selectors/models/BasePool'

import {
  CompositionBlock,
  CompositionType,
  IPoolModel,
  IPoolModelBuilder,
} from './types'

export class ComposableStablePool extends BasePool {
  constructor(
    pool: IPool,
    compositionBlocks: CompositionBlock[],
    chainId: string,
  ) {
    super(pool, compositionBlocks, chainId)
  }

  get pool(): IPool {
    return this._pool
  }

  get allTokens(): IToken[] {
    const tokens: IToken[] = []

    for (const compositionBlock of this._compositionBlocks) {
      if (compositionBlock.type === CompositionType.TOKEN) {
        tokens.push(compositionBlock.value as IToken)
      } else if (compositionBlock.type === CompositionType.POOL) {
        tokens.push(...(compositionBlock.value as IPoolModel).pool.tokens)
        tokens.push(...(compositionBlock.value as IPoolModel).depositTokens)
      }
    }

    return uniqBy(tokens, 'address')
  }

  get depositTokens(): IToken[] {
    const tokens: IToken[] = []
    const poolConfig = getPoolConfig(this.address, this._chainId)
    const depositAddresses = poolConfig?.depositTokens?.map((depositAddress) =>
      address(depositAddress),
    )

    if (depositAddresses) {
      return this.allTokens.filter((token) =>
        depositAddresses.includes(address(token.address)),
      )
    }

    for (const compositionBlock of this._compositionBlocks) {
      if (compositionBlock.type === CompositionType.TOKEN) {
        tokens.push(compositionBlock.value as IToken)
      } else if (compositionBlock.type === CompositionType.POOL) {
        tokens.push(...(compositionBlock.value as IPoolModel).depositTokens)
      }
    }

    return tokens
  }

  get compositionBlocks(): CompositionBlock[] {
    return this._compositionBlocks
  }
}

export class ComposableStablePoolBuilder implements IPoolModelBuilder {
  private readonly _compositionBlocks: CompositionBlock[] = []

  constructor(public readonly pool: IPool, public readonly chainId: string) {
    if (ComposableStablePoolBuilder.approve(pool)) {
      return this
    } else {
      throw new Error('Not ComposableStablePool')
    }
  }

  static approve(pool: IPool): boolean {
    return pool.poolType === PoolType.ComposableStable
  }

  public addCompositionBlock(block: CompositionBlock): this {
    this._compositionBlocks.push(block)

    return this
  }

  build(): ComposableStablePool {
    return new ComposableStablePool(
      this.pool,
      this._compositionBlocks,
      this.chainId,
    )
  }
}
