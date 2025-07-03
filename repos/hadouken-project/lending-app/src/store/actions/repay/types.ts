import { BigNumber } from 'ethers'

export enum BorrowType {
  stable = 1,
  variable = 2,
}

export interface IRepayPayload {
  assetAddress: string
  amount: BigNumber
  borrowType: BorrowType
  repayAll: boolean
  slippage: number
}
