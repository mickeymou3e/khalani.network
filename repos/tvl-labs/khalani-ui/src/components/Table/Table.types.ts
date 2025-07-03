import { ReactElement } from 'react'

import { TableProps } from '@mui/material/Table'
import { TableCellProps } from '@mui/material/TableCell'

type fieldValue = string | number | ReactElement

export interface IColumn {
  value: fieldValue
  name: string
  width: string
  align?: TableCellProps['align']
  sortOrder?: ESortOrder
  sortDefault?: boolean
}

export interface IRow {
  id: string
  cells: {
    [key: string]: {
      value: number | string | ReactElement
      sortingValue?: string | number
      filteringValue?: string[]
    }
  }
}

export interface TableHeadProps {
  columns: IColumn[]
  displayHeader?: boolean
  selectedTab?: number | string
  handleTabChange?: (
    event: React.SyntheticEvent,
    value: number | string,
  ) => void
  tabs?: {
    label: string
    value: string
  }[]
}

export interface TableBodyProps {
  columns: IColumn[]
  rows?: IRow[]
  RouterLink?: React.ElementType
  redirectPath?: string
  isLoading?: boolean
  handleRowClick?: (id: string) => void
}

export interface ITableProps
  extends TableProps,
    TableHeadProps,
    TableBodyProps {
  filteringParams?: FilteringParams
}

export interface FilteringParams {
  tokenSymbol?: string
  network?: string
}

export enum ESortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum EAlign {
  RIGHT = 'right',
  LEFT = 'left',
}
