import { ButtonProps } from '@mui/material'
import { Network } from '@tvl-labs/sdk'

export interface IConfirmButtonProps extends ButtonProps {
  onClick: () => void
  text: string
  disabled: boolean
  expectedNetwork: Network
  insufficientBalance?: boolean
  isLoading?: boolean
}
