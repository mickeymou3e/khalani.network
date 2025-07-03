import uniqBy from 'lodash/uniqBy'

import { getPoolConfig } from '@dataSource/graph/pools/pools/constants'
import { address } from '@dataSource/graph/utils/formatters'
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
  protected readonly _chainId: string

  constructor(
    pool: IPool,
    compositionBlocks: CompositionBlock[],
    chainId: string,
  ) {
    this._pool = pool
    this._compositionBlocks = compositionBlocks
    this._chainId = chainId
  }

  get id(): string {
    return this._pool.id
  }

  get address(): string {
    return this._pool.address
  }

  get pool(): IPool {
    return this._pool
  }

  get tokens(): IToken[] {
    return this.compositionBlocks.reduce<IToken[]>(
      (tokens, compositionBlock) => {
        if (compositionBlock.type === CompositionType.TOKEN) {
          tokens.push(compositionBlock.value as IToken)
        } else if (compositionBlock.type === CompositionType.POOL) {
          const poolModel = compositionBlock.value as IPoolModel
          const poolConfig = getPoolConfig(poolModel.address, this._chainId)
          tokens.push({
            id: poolModel.id,
            address: poolModel.address,
            name: poolModel.pool.name,
            symbol: poolModel.pool.symbol,
            decimals: 18,
            displayName: poolConfig?.displayName,
            isLendingToken: false,
            isLpToken: true,
            source: 'gw',
          } as IToken)
        }

        return tokens
      },
      [],
    )
  }

  get allTokens(): IToken[] {
    return uniqBy([...this.tokens, ...this.depositTokens], 'address')
  }

  get depositTokens(): IToken[] {
    const tokens: IToken[] = []

    const poolConfig = getPoolConfig(this.address, this._chainId)

    const depositAddresses = poolConfig?.depositTokens?.map((tokenAddress) =>
      address(tokenAddress),
    )

    const useDepositConfig = Boolean(depositAddresses)

    for (const compositionBlock of this._compositionBlocks) {
      if (compositionBlock.type === CompositionType.TOKEN) {
        if (
          !useDepositConfig ||
          depositAddresses?.includes(address(compositionBlock.value.address))
        ) {
          tokens.push(compositionBlock.value as IToken)
        }
      } else if (compositionBlock.type === CompositionType.POOL) {
        const allTokens = (compositionBlock.value as IPoolModel).depositTokens
        if (useDepositConfig) {
          const filterTokens = allTokens.filter((token) =>
            depositAddresses?.includes(address(token.address)),
          )
          tokens.push(...filterTokens)
        } else {
          tokens.push(...allTokens)
        }
      }
    }
    return tokens
  }

  get compositionBlocks(): CompositionBlock[] {
    return this._compositionBlocks
  }
}

export class BasePoolBuilder implements IPoolModelBuilder {
  private readonly _compositionBlocks: CompositionBlock[] = []

  constructor(public readonly pool: IPool, public readonly chainId: string) {
    if (BasePoolBuilder.approve(pool)) {
      return this
    } else {
      throw new Error('Not ComposableStablePool')
    }
  }

  static approve(_pool: IPool): boolean {
    return true
  }

  public addCompositionBlock(block: CompositionBlock): this {
    this._compositionBlocks.push(block)

    return this
  }

  build(): BasePool {
    return new BasePool(this.pool, this._compositionBlocks, this.chainId)
  }
}
