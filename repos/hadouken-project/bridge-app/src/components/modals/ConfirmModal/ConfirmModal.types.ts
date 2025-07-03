export interface IConfirmModalProps {
  title: string
  open: boolean
  handleClose?: () => void
  description: string
  handleAction?: () => void
}
