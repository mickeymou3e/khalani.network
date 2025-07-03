import { BorrowPanelProps } from '@components/panels/BorrowPanel/BorrowPanel.types'
import { IRow } from '@hadouken-project/ui'

export interface IDashboardMobileProps {
  balance: string
  args: BorrowPanelProps
  deposits?: IRow[]
  borrows?: IRow[]
}
