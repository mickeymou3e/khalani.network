import { IModal } from '@interfaces/core'

export interface ISelectWalletModalProps extends IModal {
  description?: string
  metaMaskSelected?: () => void
}
