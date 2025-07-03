import { Explorer, IModal } from '@interfaces/core'

export interface IUserAddressesModal extends IModal {
  handleCreateNervosAccount?: () => void
  addresses: {
    address: string | null
    networkName: string
    explorers: Explorer[]
  }[]
  onLogout: () => void
}
