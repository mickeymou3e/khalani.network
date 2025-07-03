import { IModal } from '@interfaces/core'

export interface IChangeNetworkModalProps extends IModal {
  previousNetwork?: string
  expectedNetwork?: string
  changeNetwork?: () => void
}
