import { IOperation, ETransactionStatus } from '@interfaces/core'
import { BoxProps } from '@mui/material/Box'
import { MenuProps } from '@mui/material/Menu'

export interface IHistoryDropdownProps {
  title: string
  status: ETransactionStatus
  date: Date
  operations: IOperation[]
  width: BoxProps['width']
  anchorElement: MenuProps['anchorEl']
  open: MenuProps['open']
  onClose: MenuProps['onClose']
}
