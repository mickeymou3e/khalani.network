import { ITokenSelectorBalance } from '@components/inputs/TokenSelectorInput'
import { TokenModelBalance } from '@interfaces/core'
import { DialogProps } from '@mui/material'

export interface ITokenSelectorModalProps extends Omit<DialogProps, 'onClose'> {
  tokens: TokenModelBalance[]
  balances: ITokenSelectorBalance[]
  onClose: () => void
  selectedToken?: TokenModelBalance
  onTokenSelect?: (token: TokenModelBalance) => void
  hideBalances?: boolean
}
