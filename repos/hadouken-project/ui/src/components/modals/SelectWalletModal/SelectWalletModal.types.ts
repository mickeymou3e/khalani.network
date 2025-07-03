import { IModal } from '@interfaces/core'

export interface ISelectWalletModalProps extends IModal {
  description?: string
  onMetaMaskSelect?: () => void
  onWalletConnectSelect?: () => void
  disableMetamask: boolean
  disableWalletConnect: boolean
}
