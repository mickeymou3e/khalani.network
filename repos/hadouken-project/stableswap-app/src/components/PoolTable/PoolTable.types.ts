import { IPool } from '@interfaces/pool'
import { IToken } from '@interfaces/token'

export interface IPoolTable {
  pools: IPool[]
  tokens: IToken[]
  onPoolClick: (poolId: string) => void
}
