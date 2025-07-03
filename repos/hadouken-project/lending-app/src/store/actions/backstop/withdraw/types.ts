import { BigNumber } from 'ethers'

export interface IBackstopWithdrawPayload {
  assetAddress: string
  amount: BigNumber
}
