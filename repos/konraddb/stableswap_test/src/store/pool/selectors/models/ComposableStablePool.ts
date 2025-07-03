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
  constructor(pool: IPool, compositionBlocks: CompositionBlock[]) {
    super(pool, compositionBlocks)
  }

  get pool() {
    return this._pool
  }

  get depositTokens() {
    const tokens: IToken[] = []
    for (const compositionBlock of this._compositionBlocks) {
      if (compositionBlock.type === CompositionType.TOKEN) {
        tokens.push(compositionBlock.value as IToken)
      } else if (compositionBlock.type === CompositionType.POOL) {
        tokens.push(...(compositionBlock.value as IPoolModel).depositTokens)
      }
    }

    return tokens
  }

  get compositionBlocks() {
    return this._compositionBlocks
  }
}

export class ComposableStablePoolBuilder implements IPoolModelBuilder {
  private readonly _compositionBlocks: CompositionBlock[] = []

  constructor(public readonly pool: IPool) {
    if (ComposableStablePoolBuilder.approve(pool)) {
      return this
    } else {
      throw new Error('Not ComposableStablePool')
    }
  }

  static approve(pool: IPool) {
    return pool.poolType === PoolType.ComposableStable
  }

  public addCompositionBlock(block: CompositionBlock) {
    this._compositionBlocks.push(block)

    return this
  }

  build(): any {
    return new ComposableStablePool(this.pool, this._compositionBlocks)
  }
}
