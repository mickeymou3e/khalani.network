import { IChildren } from '@interfaces/children'

export interface IModalProps extends IChildren {
  open: boolean
  handleClose?: () => void
}
