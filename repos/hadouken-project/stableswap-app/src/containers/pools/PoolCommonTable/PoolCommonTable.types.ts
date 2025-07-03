import { IColumn, IRow } from '@hadouken-project/ui'

export interface PoolCommonTableProps {
  columns: IColumn[]
  rows: IRow[]
  isFetching: boolean
  transactionsAmount: number
  loadMoreTransactions: () => void
  hasMore: boolean
  message: string
}
