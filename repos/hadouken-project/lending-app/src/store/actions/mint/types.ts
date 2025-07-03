import { BigNumber } from 'ethers'

export interface IMintPayload {
  assetAddress: string
  amount: BigNumber
}
