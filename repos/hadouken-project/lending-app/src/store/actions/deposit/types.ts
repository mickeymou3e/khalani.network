import { BigNumber } from 'ethers'

export interface IDepositPayload {
  assetAddress: string
  amount: BigNumber
}
