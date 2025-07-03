import { IUSDAmount } from '@interfaces/core'
import { InputBaseProps } from '@mui/material/InputBase'

import { IInputProps } from '../Input/Input.types'

export interface IBigNumberInputProps
  extends Omit<InputBaseProps, 'onChange' | 'inputComponent' | 'value'> {
  value?: bigint
  decimals?: number
  maxAmount?: bigint
  loading?: boolean
  onChange?: (value: bigint | undefined) => void
  InputComponent?: React.FC<IInputProps>
  usdAmount?: IUSDAmount
  hideUSDAmount?: boolean
  topLabel?: string
}
