import { IPool, PoolType } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import { BasePool } from '@store/pool/selectors/models/BasePool'
import { isDebtToken } from '@utils/token'

import {
  CompositionBlock,
  CompositionType,
  IPoolModel,
  IPoolModelBuilder,
} from './types'

export class LinearPool extends BasePool {
  constructor(pool: IPool, compositionBlocks: CompositionBlock[]) {
    super(pool, compositionBlocks)
  }

  get depositTokens() {
    const tokens: IToken[] = []
    for (const compositionBlock of this._compositionBlocks) {
      if (compositionBlock.type === CompositionType.TOKEN) {
        const token = compositionBlock.value as IToken
        if (!isDebtToken(token.address)) {
          tokens.push(token)
        }
      } else if (compositionBlock.type === CompositionType.POOL) {
        tokens.push(...(compositionBlock.value as IPoolModel).depositTokens)
      }
    }
    return tokens
  }
}

export class LinearPoolBuilder implements IPoolModelBuilder {
  private readonly _compositionBlocks: CompositionBlock[] = []

  constructor(public readonly pool: IPool) {
    if (LinearPoolBuilder.approve(pool)) {
      return this
    } else {
      throw new Error('Not LinearPool')
    }
  }

  static approve(pool: IPool) {
    return (
      pool.poolType === PoolType.Linear || pool.poolType === PoolType.AaveLinear
    )
  }

  public addCompositionBlock(block: CompositionBlock) {
    this._compositionBlocks.push(block)

    return this
  }

  build(): any {
    return new LinearPool(this.pool, this._compositionBlocks)
  }
}
