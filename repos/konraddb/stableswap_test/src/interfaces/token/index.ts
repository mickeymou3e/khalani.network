import { IPoolToken } from '@dataSource/graph/pools/poolsTokens/types'
import { Address } from '@interfaces/data'
import { BigDecimal } from '@utils/math'

export interface IToken {
  id: Address
  address: Address
  name: string
  symbol: string
  decimals: number
}

export interface ITokenWithBalance extends IToken {
  balance: BigDecimal
}

// TODO: Refactor!!!!!!!
export type PoolTokenBalance = Omit<IPoolToken, 'balance'> & {
  balance: BigDecimal
}
