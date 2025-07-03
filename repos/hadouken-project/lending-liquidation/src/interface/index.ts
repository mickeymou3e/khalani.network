import { BigNumber } from 'ethers'

export interface DepositAsset {
  tokenBalance: TokenBalance
  isCollateral: boolean
}

export interface TokenBalance {
  id: string
  tokenAddress: string
  walletAddress: string
  balance: BigNumber
}

export interface Price {
  symbol: string
  rate: BigNumber
}

export interface User {
  id: string
  depositAssets: DepositAsset[]
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
}

export type DebtReserve = Reserve & {
  totalDebt: BigNumber
  totalDebtInDollars: BigNumber
}

export type CollateralReserve = Reserve & {
  totalCollateral: BigNumber
  totalCollateralInDollars: BigNumber
}

export type MaxCollateral = {
  maxAmountCollateralToLiquidate: BigNumber
  maxAmountCollateralToLiquidateInDollars: BigNumber
}

export interface LiquidityThresholdCalculationParams {
  isCollateral: boolean
  symbol: string
  value: BigNumber
  liquidityThreshold: BigNumber
}
