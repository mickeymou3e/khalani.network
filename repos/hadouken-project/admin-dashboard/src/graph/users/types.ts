import { BigNumber } from 'ethers'

import { ApolloQueryResult } from '@apollo/client'

import { ApolloRequest } from '../types'

export interface ATokenAsset {
  id: string
  address: string
  underlyingAsset: string
  scaledBalance: string
  isCollateral: boolean
}

export interface VariableDebtTokenAsset {
  id: string
  address: string
  underlyingAsset: string
  scaledVariableDebt: string
}

export interface StableDebtTokenAsset {
  id: string
  address: string
  underlyingAsset: string
  principalStableDebt: string
}

export interface IUserAccountData {
  totalCollateral: BigNumber
  totalDeposit: BigNumber
  totalBorrow: BigNumber
  currentLiquidationThreshold: BigNumber
  ltv: BigNumber
  aTokenAssets: ATokenAsset[]
  stableBorrowAssets: StableDebtTokenAsset[]
  variableBorrowAssets: VariableDebtTokenAsset[]
}
export interface IUser {
  id: string
  aTokenAssets: ATokenAsset[]
  stableBorrowAssets: StableDebtTokenAsset[]
  variableBorrowAssets: VariableDebtTokenAsset[]
}

export interface IUsersQueryResult {
  users: IUser[]
}

export type IApolloUsersQueryResult = ApolloRequest<
  ApolloQueryResult<IUsersQueryResult>
>
