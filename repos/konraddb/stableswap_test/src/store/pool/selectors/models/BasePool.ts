import { IPool } from '@interfaces/pool'
import { IToken } from '@interfaces/token'

import {
  CompositionBlock,
  CompositionType,
  IPoolModel,
  IPoolModelBuilder,
} from './types'

export class BasePool implements IPoolModel {
  protected readonly _pool: IPool
  protected readonly _compositionBlocks: CompositionBlock[]

  constructor(pool: IPool, compositionBlocks: CompositionBlock[]) {
    this._pool = pool
    this._compositionBlocks = compositionBlocks
  }

  get id() {
    return this._pool.id
  }

  get address() {
    return this._pool.address
  }

  get pool() {
    return this._pool
  }

  // TODO change to reduce
  get tokens(): IToken[] {
    return this.compositionBlocks
      .map((compositionBlock) => {
        if (compositionBlock.type === CompositionType.TOKEN) {
          return compositionBlock.value as IToken
        } else if (compositionBlock.type === CompositionType.POOL) {
          const poolModel = compositionBlock.value as IPoolModel

          return {
            id: poolModel.id,
            address: poolModel.address,
            name: poolModel.pool.name,
            symbol: poolModel.pool.symbol,
            decimals: 18,
          } as IToken
        }

        return null
      })
      .filter((x) => x !== null) as IToken[]
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

export class BasePoolBuilder implements IPoolModelBuilder {
  private readonly _compositionBlocks: CompositionBlock[] = []

  constructor(public readonly pool: IPool) {
    if (BasePoolBuilder.approve(pool)) {
      return this
    } else {
      throw new Error('Not ComposableStablePool')
    }
  }

  static approve(_pool: IPool) {
    return true
  }

  public addCompositionBlock(block: CompositionBlock) {
    this._compositionBlocks.push(block)

    return this
  }

  build(): any {
    return new BasePool(this.pool, this._compositionBlocks)
  }
}
