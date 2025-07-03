export interface IMaxAmountSelectorProps {
  maxAmount: bigint
  isSlider: boolean
  onSliderChange?: (value: number) => void
  decimals?: number
  disabled?: boolean
  onMaxClick?: () => void
  isFetchingMaxAmount?: boolean
  symbol?: string
  bottomText?: string
  hideMaxButton?: boolean
}
