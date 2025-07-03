import React from 'react'

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import RemoveIcon from '@mui/icons-material/Remove'
import TableCell from '@mui/material/TableCell'
import MUITableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import { IColumn, TableHeadProps } from './Table.types'

const TableHead: React.FC<TableHeadProps> = ({
  columns,
  sortedColumnName,
  sortDesc,
  onSortColumn,
  onSortDesc,
  displayHeader,
}) => {
  const onSortClickHandle = (name: string) => {
    if (!onSortColumn) return

    if (name !== sortedColumnName) {
      onSortColumn(name)
      onSortDesc?.(true)
      return
    }

    if (sortDesc === undefined) {
      onSortDesc?.(sortDesc)
    } else {
      onSortDesc?.(!sortDesc)
    }
  }

  const renderIcon = (column: IColumn) => {
    if (column.isSortable && column.name === sortedColumnName) {
      return (
        <>
          {sortDesc === undefined ? (
            <RemoveIcon />
          ) : sortDesc ? (
            <ArrowDownwardIcon />
          ) : (
            <ArrowUpwardIcon />
          )}
        </>
      )
    } else if (column.isSortable) {
      return <RemoveIcon />
    }
    return null
  }
  return (
    <MUITableHead
      sx={{ display: displayHeader ? 'table-header-group' : 'none' }}
    >
      <TableRow hover>
        {columns.map((column, index) => (
          <TableCell
            align={column.align}
            sx={{ width: column.width, paddingY: 2, paddingX: 3 }}
            key={index}
            variant="head"
          >
            <div
              onClick={
                column.isSortable
                  ? () => onSortClickHandle(column.name)
                  : () => null
              }
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                cursor: column.isSortable ? 'pointer' : 'default',
              }}
            >
              {column.value}
              {renderIcon(column)}
            </div>
          </TableCell>
        ))}
      </TableRow>
    </MUITableHead>
  )
}

export default TableHead
