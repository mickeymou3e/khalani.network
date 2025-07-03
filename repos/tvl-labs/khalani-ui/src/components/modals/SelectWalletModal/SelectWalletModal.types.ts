import { Wallet } from '@interfaces/wallet'
import { DialogProps } from '@mui/material'

export interface ISelectWalletModalProps extends Omit<DialogProps, 'onClose'> {
  wallets: Wallet[]
  onClose: () => void
  onWalletSelect: (type: string) => void
}
