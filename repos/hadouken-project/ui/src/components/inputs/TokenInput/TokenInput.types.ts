import { BigNumber } from 'ethers'

import { IMaxAmountSelectorProps } from '@components/MaxAmountSelector/MaxAmountSelector.types'
import { TokenModel } from '@interfaces/core'

export interface ITokenInputProps {
  token?: TokenModel
  amount?: BigNumber
  maxAmount?: BigNumber
  isFetchingMaxAmount?: IMaxAmountSelectorProps['isFetchingMaxAmount']
  disabled?: boolean
  onAmountChange?: (amount: BigNumber | undefined) => void
  onMaxRequest?: (address: string) => void
  error?: string
  hideStartAdornment?: boolean
  maxInputDisabled?: boolean
  tokenIconStyle?: {
    width: number
    height: number
  }
  isFetching?: boolean
}
