import { IPoolToken } from '@dataSource/graph/pools/poolsTokens/types'
import { ISvgRenderer } from '@hadouken-project/ui'
import { BigDecimal } from '@utils/math'

export interface IEntity {
  id: string
  name: string
}

export interface TokenBalance {
  value: BigDecimal
  tokenAddress: string
}

export interface IToken {
  id: string
  address: string
  name: string
  symbol: string
  decimals: number
  displayName: string
  source?: string
  isLpToken?: boolean
  isLendingToken?: boolean
  unwrappedAddress?: string
}

export type AaveAPYToken = {
  id: string
  underlyingAddress: string
  address: string
  wrappedAddress: string
  APY: BigDecimal
}

export interface IEntityWithIconComponent extends IEntity, ISvgRenderer {}

// TODO: Refactor!!!!!!!
export type PoolTokenBalance = Omit<IPoolToken, 'balance'> & {
  balance: BigDecimal
}

export type Balances = Record<string, BigDecimal> | undefined | null
