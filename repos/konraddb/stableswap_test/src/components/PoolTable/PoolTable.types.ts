import { IPool } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import { ByPoolId } from '@store/pool/pool.types'

export interface IPoolTable {
  pools: IPool[]
  tokensByPoolId: ByPoolId<IToken[] | undefined>
  tokens: IToken[]
  onPoolClick: (poolId: string) => void
}
