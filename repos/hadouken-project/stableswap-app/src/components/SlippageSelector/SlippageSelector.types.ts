import { BigNumber } from 'ethers'

export interface ISlippageSelectorProps {
  slippage?: BigNumber
  onSlippageChange?: (value: BigNumber) => void
  decimals?: number
}
