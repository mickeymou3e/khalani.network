import { IUserAddressesModal } from '@hadouken-project/ui'
import { ConnectionStage } from '@store/wallet/connection/types'

export interface IModalContainerProps {
  open: boolean
  setOpen: (value: boolean) => void
  connectionStage: ConnectionStage
  connectToMetaMask?: () => void
  installMetaMask?: () => void
  openAddressModal: boolean
  handleCloseAddressModal?: () => void
  addresses: IUserAddressesModal['addresses']
}
