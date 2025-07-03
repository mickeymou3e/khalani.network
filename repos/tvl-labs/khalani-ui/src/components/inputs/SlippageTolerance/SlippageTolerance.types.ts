import { Dispatch, SetStateAction } from 'react'

import { InputBaseProps } from '@mui/material/InputBase'

export interface ISlippageToleranceProps extends InputBaseProps {
  value: bigint | undefined
  setValue: Dispatch<SetStateAction<bigint | undefined>>
  onValueChange: (value: bigint | undefined) => void
  loading?: boolean
}
