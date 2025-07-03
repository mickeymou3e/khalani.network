import { BigNumber } from 'ethers'

import { IInitializeSaga } from '@interfaces/data'

export type IUsersSagaState = IInitializeSaga

export interface TokenBalance {
  id: string
  tokenAddress: string
  walletAddress: string
  balance: BigNumber
  balanceInDollars?: BigNumber
  symbol?: string
  decimals?: number
}

export interface DisplayTokenBalance {
  balance: BigNumber
  balanceInDollars: BigNumber
  symbol: string
  decimals: number
}

export interface User {
  id: string
  healthFactor: string
  borrowedTokens: TokenBalance[]
  collateralTokens: TokenBalance[]
}
