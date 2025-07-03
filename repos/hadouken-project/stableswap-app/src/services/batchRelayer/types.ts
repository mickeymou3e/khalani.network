import { BigNumber, BigNumberish } from 'ethers'

export type Address = string

export enum SwapTokenType {
  fixed,
  min,
  max,
}

export interface SwapToken {
  token: string
  amount: BigNumber
  type: SwapTokenType
}

export type BatchSwapStep = {
  poolId: string
  assetInIndex: number
  assetOutIndex: number
  amount: string
  userData: string
}

export type FundManagement = {
  sender: string
  recipient: string
  fromInternalBalance: boolean
  toInternalBalance: boolean
}

export enum SwapType {
  SwapExactIn,
  SwapExactOut,
}

export type SingleSwap = {
  poolId: string
  kind: SwapType
  assetIn: string
  assetOut: string
  amount: BigNumberish
  userData: string
}

export interface SwapV2 {
  poolId: string
  assetInIndex: number
  assetOutIndex: number
  amount: string
  userData: string
}
