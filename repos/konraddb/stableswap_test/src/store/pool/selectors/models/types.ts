import { IPool } from '@interfaces/pool'
import { IToken } from '@interfaces/token'

export interface IPoolModel extends Pick<IPool, 'id' | 'address'> {
  readonly pool: IPool

  readonly tokens: IToken[]
  readonly depositTokens: IToken[]

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
