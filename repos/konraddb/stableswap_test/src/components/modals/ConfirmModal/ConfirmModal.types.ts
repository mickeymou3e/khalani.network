import { IPoolToken } from '@dataSource/graph/pools/poolsTokens/types'

export interface IConfirmModalProps {
  title: string
  open: boolean
  handleClose?: () => void
  tokens: IPoolToken[]
  handleAction?: () => void
}
