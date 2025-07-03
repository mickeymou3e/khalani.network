import { BigNumber } from 'ethers'

import { ApolloQueryResult } from '@apollo/client'

import { ApolloRequest } from '../types'

export interface IReserve {
  id: string
  address: string
  symbol: string
  decimals: number
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

export interface IPool {
  id: string
  addressProvider: string
  admin: string
  adminFee: string
  createdAt: string
  reserves: IReserve[]
}

export interface IPoolQueryResult {
  pools: IPool[]
}

export interface IReservesQueryResult {
  reserves: IReserve[]
}

export type IApolloPoolQueryResult = ApolloRequest<
  ApolloQueryResult<IPoolQueryResult>
>

export type IApolloReservesQueryResult = ApolloRequest<
  ApolloQueryResult<IReservesQueryResult>
>
