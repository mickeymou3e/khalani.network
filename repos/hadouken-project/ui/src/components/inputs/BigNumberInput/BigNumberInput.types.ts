import { BigNumber } from 'ethers'

import { InputBaseProps } from '@mui/material/InputBase'

import { IInputProps } from '../Input/Input.types'

export interface IBigNumberInputProps
  extends Omit<InputBaseProps, 'onChange' | 'inputComponent' | 'value'> {
  value?: BigNumber
  decimals?: number
  maxAmount?: BigNumber
  loading?: boolean
  onChange?: (value: BigNumber | undefined) => void
  InputComponent?: React.FC<IInputProps>
}
