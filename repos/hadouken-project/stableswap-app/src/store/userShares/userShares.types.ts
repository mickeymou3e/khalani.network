import { BigDecimal } from '@utils/math'

export type TokenBalances = {
  [tokenAddress: string]: BigDecimal | null | undefined
}

export type DepositBalances = {
  [poolAddress: string]: TokenBalances | undefined | null
}

export type DepositTokenBalances = {
  depositTokenBalances: DepositBalances
}

export type IUserShareSagaState = DepositTokenBalances & {
  initialized: boolean
  isFetching: boolean
}

export interface IUserShares {
  sharesOwned: {
    [key: string]: BigDecimal
  }
  id: string
}
