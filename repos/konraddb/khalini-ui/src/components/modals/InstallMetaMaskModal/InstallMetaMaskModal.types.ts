import { IModal } from '@interfaces/core'

export interface IInstallMetaMaskModalProps extends IModal {
  handleGoBack?: () => void
  handleInstallMetaMask?: () => void
}
