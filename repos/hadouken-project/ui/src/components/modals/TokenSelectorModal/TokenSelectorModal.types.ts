import { TokenModelBalance, TokenModelBalanceWithIcon } from '@interfaces/core'
import { DialogProps } from '@mui/material'

export interface ITokenSelectorModalProps extends Omit<DialogProps, 'onClose'> {
  tokens: TokenModelBalanceWithIcon[]
  selectedToken?: TokenModelBalance
  onTokenSelect?: (token: TokenModelBalanceWithIcon) => void
  onClose: () => void
  isFetching?: boolean
}
