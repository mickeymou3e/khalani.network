import { BigNumber } from 'ethers'

export interface ICollateralPayload {
  asset: string
  amount: BigNumber
  useAsCollateral: boolean
}
