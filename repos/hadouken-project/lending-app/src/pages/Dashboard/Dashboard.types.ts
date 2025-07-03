import { BigNumber } from 'ethers'

export interface LiquidityThresholdCalculationParams {
  isCollateral: boolean
  symbol: string
  value: BigNumber
  liquidityThreshold: BigNumber
}
