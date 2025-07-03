import { BigNumber } from 'ethers'

export interface IWithdrawPayload {
  assetAddress: string
  amount: BigNumber
  withdrawAll: boolean
}
