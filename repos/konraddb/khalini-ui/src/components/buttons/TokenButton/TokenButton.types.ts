import { ReactNode } from 'react'

import { ButtonProps } from '@mui/material'

export interface ITokenButtonProps extends ButtonProps {
  select?: boolean
  symbol?: string
  name?: string
  customIcon?: ReactNode
}
