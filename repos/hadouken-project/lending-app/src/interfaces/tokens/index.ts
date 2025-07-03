import { BigNumber } from 'ethers'

import { Address } from '@interfaces/data'

export interface IEntity {
  id: string
  name: string
}

export interface ISvg {
  height?: number
  width?: number
  fill?: string
}

export interface ISvgRenderer {
  icon: React.FC<ISvg>
}

export interface IFetchable {
  isFetching?: boolean
}

export interface ITokenValueWithNameAndCollateral
  extends ITokenValueWithCustomName {
  isCollateral: boolean
}

export interface ITokenValueWithCustomName extends ITokenValue {
  name: string
}

export interface IBorrowBalanceToken extends ITokenValueWithCustomName {
  address: string
  isVariableDebt: boolean
  isStableDebt: boolean
}

export interface ITokenValue {
  address: string
  symbol: string
  value: BigNumber
  decimals: number
  displayName: string
}

export type ITokenFetchValue = ITokenValue & IFetchable

export interface ITokenBalance {
  id: string
  walletAddress: string
  tokenAddress: string
  balance: string
  updatedAt?: number
}

export interface TokenModel {
  id: Address
  address: Address
  name: string
  symbol: string
  decimals: number
  displayName: string
  source: string
  isAToken?: boolean
  isStableDebt?: boolean
  isVariableDebt?: boolean
}

export interface IEntityWithIconComponent extends IEntity, ISvgRenderer {}

export interface IReserve {
  id: string
  address: string
  symbol: string
  decimals: number
  displayName: string
  aTokenAddress: string
  stableDebtTokenAddress: string
  variableBorrowIndex: BigNumber
  variableDebtTokenAddress: string
  interestRateStrategyAddress: string
  availableLiquidity: BigNumber
  stableBorrowRate: BigNumber
  variableBorrowRate: BigNumber
  totalStableDebt: BigNumber
  totalVariableDebt: BigNumber
  liquidityRate: BigNumber
  liquidityIndex: BigNumber
  ltv: BigNumber
  liquidityThreshold: BigNumber
  liquidityBonus: number
  isActive: boolean
  isFrozen: boolean
  isBorrowingEnable: boolean
  isStableBorrowingEnable: boolean
  lastUpdateTimestamp: BigNumber
  depositCap: BigNumber
  borrowCap: BigNumber
}
