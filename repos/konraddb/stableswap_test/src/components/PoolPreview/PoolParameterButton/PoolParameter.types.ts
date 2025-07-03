import { ButtonProps } from '@mui/material'

export interface IPoolParameterButtonProps extends ButtonProps {
  name: string
  description?: string
}

export enum PoolParameterType {
  Primary,
  Secondary,
}
