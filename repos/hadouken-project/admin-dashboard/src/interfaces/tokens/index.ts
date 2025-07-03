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
  symbol: string
  value: BigNumber
  decimals: number
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
  isAToken?: boolean
  isStableDebt?: boolean
  isVariableDebt?: boolean
}

export interface IEntityWithIconComponent extends IEntity, ISvgRenderer {}
