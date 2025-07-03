import { BigNumber } from 'ethers'

export interface IBackstopDepositPayload {
  assetAddress: string

  amount: BigNumber
}
