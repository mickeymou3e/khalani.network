import { IRow } from '@tvl-labs/khalani-ui'

export interface HistoryListContainerProps {
  rowClickFn: (id: string) => void
  rows: IRow[]
  isLoading: boolean
}
