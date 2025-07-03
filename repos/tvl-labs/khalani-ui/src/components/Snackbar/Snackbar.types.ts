import { ReactNode } from 'react'

export interface SnackbarProps {
  open: boolean
  onClose: () => void
  message: ReactNode
}
