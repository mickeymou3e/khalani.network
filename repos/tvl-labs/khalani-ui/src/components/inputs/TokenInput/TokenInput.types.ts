import { IMaxAmountSelectorProps } from '@components/MaxAmountSelector/MaxAmountSelector.types'
import { TokenModel, IUSDAmount } from '@interfaces/core'

export interface ITokenInputProps {
  token?: TokenModel
  tokens?: TokenModel[]
  amount?: bigint
  maxAmount?: bigint
  isFetchingMaxAmount?: IMaxAmountSelectorProps['isFetchingMaxAmount']
  disabled?: boolean
  onAmountChange?: (amount: bigint | undefined) => void
  onMaxRequest?: (address: string) => void
  error?: boolean
  bottomText?: string
  onButtonClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  usdAmount?: IUSDAmount
  customTokenSymbol?: string
  onSliderChange?: (value: number) => void
  topLabel?: string
  isSlider?: boolean
  isStkToken?: boolean
  fromSelector?: boolean
  hideTokenButton?: boolean
  hideMaxButton?: boolean
}
