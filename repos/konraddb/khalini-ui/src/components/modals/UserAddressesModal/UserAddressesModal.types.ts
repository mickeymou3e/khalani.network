import { Explorer, IModal } from '@interfaces/core'

export interface IUserAddressesModal extends IModal {
  handleCreateNervosAccount?: () => void
  addresses: { address: string; networkName: string; explorers: Explorer[] }[]
}
