import { IPool } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import { BigDecimal } from '@utils/math'

export type ITokenWithWeight = IToken & { weight?: BigDecimal }

export interface IPoolModel extends Pick<IPool, 'id' | 'address'> {
  readonly pool: IPool

  readonly tokens: (IToken & { weight?: BigDecimal })[]
  readonly allTokens: (IToken & { weight?: BigDecimal })[]
  readonly depositTokens: (IToken & { weight?: BigDecimal })[]

  readonly compositionBlocks: CompositionBlock[]
}

export interface IPoolModelBuilder {
  addCompositionBlock(block: CompositionBlock): IPoolModelBuilder

  build(): IPoolModel
}

export enum CompositionType {
  TOKEN,
  POOL,
}

export interface CompositionBlock {
  type: CompositionType
  value: IPoolModel | IToken
}

export type PoolWithSortedTokens = {
  [poolId: string]: {
    name: string
    tokens: { id: string; symbol: string }[]
    symbol: string
    displayPoolIcon: boolean
  }
}
