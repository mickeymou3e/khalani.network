import { BigNumber } from 'ethers'

export interface ICustomizedRadioGroupProps {
  value?: BigNumber
  defaultCustomValue?: BigNumber
  decimals?: number
  maxValue?: BigNumber
  buttonLabel: string
  row?: boolean
  onSlippageChange?: (value: BigNumber) => void
}
