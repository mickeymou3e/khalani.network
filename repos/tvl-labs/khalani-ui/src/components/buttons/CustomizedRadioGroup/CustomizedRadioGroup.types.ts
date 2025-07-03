export interface ICustomizedRadioGroupProps {
  value?: bigint
  defaultCustomValue?: bigint
  decimals?: number
  maxValue?: bigint
  buttonLabel: string
  row?: boolean
  onSlippageChange?: (value: bigint) => void
}
