import { BigNumber } from 'ethers'

export interface IMaxAmountSelectorProps {
  maxAmount: BigNumber
  decimals?: number
  disabled?: boolean
  onMaxClick?: () => void
  isFetchingMaxAmount?: boolean
}
