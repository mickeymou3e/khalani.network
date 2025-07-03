import { RadioProps } from '@mui/material'

export interface IRadioButtonProps {
  sx?: RadioProps['sx']
  value: string | number
  label?: string | React.ReactNode
  disabled?: boolean
  checked?: boolean
  onClick?: () => void
}
