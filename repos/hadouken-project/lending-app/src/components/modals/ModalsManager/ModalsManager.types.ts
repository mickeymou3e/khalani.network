import { IUserAddressesModal } from '@hadouken-project/ui'
import { ConnectionState, ConnectionStatus } from '@store/wallet/wallet.types'

export interface IModalManagerProps {
  open: boolean
  setOpen: (value: boolean) => void
  connectionState: ConnectionState
  status: ConnectionStatus
  connectToMetaMask?: () => void
  installMetaMask?: () => void
  openAddressModal: boolean
  handleCloseAddressModal?: () => void
  addresses: IUserAddressesModal['addresses']
}
