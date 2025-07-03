import { PoolType } from '@interfaces/pool'
import { BigDecimal } from '@utils/math'

export interface IPoolDetailsProps {
  id: string
  address: string
  name: string
  symbol: string
  type?: PoolType
  fee: BigDecimal
  owner?: string
  manager?: string
  creationDate?: Date
  amp?: string | null
}
