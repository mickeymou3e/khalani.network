import { ReactElement } from 'react'

import { TableProps } from '@mui/material/Table'
import { TableCellProps } from '@mui/material/TableCell'

type fieldValue = string | number | ReactElement

export interface IColumn {
  value: fieldValue
  name: string
  width: string
  align?: TableCellProps['align']
  isSortable?: boolean
}

export interface IRow {
  id: string
  cells: {
    [key: string]: {
      value: number | string | ReactElement
      sortingValue?: string | number
    }
  }
}

export interface TableHeadProps {
  columns: IColumn[]
  sortedColumnName?: string
  sortDesc?: boolean
  onSortColumn?: (value?: string) => void
  onSortDesc?: (value?: boolean) => void
  displayHeader?: boolean
}

export interface TableBodyProps {
  rows?: IRow[]
  columns: IColumn[]
  onRowClick?: (value: string) => void
}

export interface ITableProps
  extends TableProps,
    TableHeadProps,
    TableBodyProps {}
