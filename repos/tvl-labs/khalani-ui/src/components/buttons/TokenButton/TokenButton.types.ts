import { ButtonProps } from '@mui/material'

export interface ITokenButtonProps extends ButtonProps {
  select?: boolean
  symbol?: string
  name?: string
  isStkToken?: boolean
}
