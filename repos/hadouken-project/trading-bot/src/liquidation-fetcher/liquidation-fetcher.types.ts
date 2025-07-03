import { BigNumber } from 'ethers'

export interface UserResponseQuery {
  id: string
  aTokenAssets: {
    id: string
    address: string
    underlyingAsset: string
    scaledBalance: string
    isCollateral: boolean
  }[]
  variableBorrowAssets: {
    id: string
    address: string
    underlyingAsset: string
    scaledVariableDebt: string
  }[]
  stableBorrowAssets: {
    id: string
    address: string
    underlyingAsset: string
    principalStableDebt: string
  }[]
}
export interface UsersResponseQuery {
  users: UserResponseQuery[]
}

export interface User {
  id: string
  aTokenAssets: ATokenAsset[]
  stableBorrowAssets: StableDebtTokenAsset[]
  variableBorrowAssets: VariableDebtTokenAsset[]
}

export interface ATokenAsset {
  address: string
  underlyingAsset: string
  scaledBalance: BigNumber
  isCollateral: boolean
}

export interface VariableDebtTokenAsset {
  address: string
  underlyingAsset: string
  scaledVariableDebt: BigNumber
}

export interface StableDebtTokenAsset {
  address: string
  underlyingAsset: string
  principalStableDebt: BigNumber
}

interface ReserveResponseQuery {
  address: string
  symbol: string
  decimals: string
  variableBorrowIndex: string
  variableBorrowRate: string
  stableBorrowRate: string
  liquidityIndex: string
  liquidityRate: string
  liquidityThreshold: string
  aTokenAddress: string
  variableDebtTokenAddress: string
  stableDebtTokenAddress: string
  liquidityBonus: string
  lastUpdateTimestamp: string
  ltv: string
  isActive: boolean
}

export interface ReservesResponseQuery {
  reserves: ReserveResponseQuery[]
}

export interface Reserve {
  address: string
  symbol: string
  decimals: number
  variableBorrowIndex: BigNumber
  variableBorrowRate: BigNumber
  stableBorrowRate: BigNumber
  liquidityIndex: BigNumber
  liquidityRate: BigNumber
  liquidityThreshold: BigNumber
  aTokenAddress: string
  variableDebtTokenAddress: string
  stableDebtTokenAddress: string
  lastUpdateTimestamp: BigNumber
  liquidityBonus: BigNumber
  ltv: BigNumber
}

export interface Balance {
  balance: BigNumber
  address: string
}

export interface Price {
  symbol: string
  rate: BigNumber
}

export interface TokenBalanceQuery {
  id: string
  tokenAddress: string
  walletAddress: string
  balance: string
}

export type TokenBalance = Pick<
  TokenBalanceQuery,
  'id' | 'tokenAddress' | 'walletAddress'
> & { balance: BigNumber }

export type LendingTokensAddresses = {
  erc20Tokens: string[]
  hTokens: string[]
  hsTokens: string[]
  hvTokens: string[]
}
