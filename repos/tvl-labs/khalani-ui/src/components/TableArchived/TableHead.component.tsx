import React from 'react'

import { ArrowDownIcon, ArrowUpIcon } from '@components/icons'
import { Box, Typography } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import MUITableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import { EAlign, ESortOrder, IColumn, TableHeadProps } from './Table.types'

const TableHead: React.FC<TableHeadProps> = (props) => {
  const { columns, onSortColumn, displayHeader } = props

  const onSortClickHandle = (column: IColumn) => {
    if (!column.sortOrder) return
    column.sortOrder =
      column.sortOrder === ESortOrder.ASC ? ESortOrder.DESC : ESortOrder.ASC
    onSortColumn?.(column.name, column.sortOrder)
  }

  const renderIcon = (column: IColumn) => {
    if (!column.sortOrder) return null
    return column.sortOrder === ESortOrder.ASC ? (
      <ArrowUpIcon />
    ) : (
      <ArrowDownIcon />
    )
  }
  return (
    <MUITableHead
      sx={{ display: displayHeader ? 'table-header-group' : 'none' }}
    >
      <TableRow hover>
        {columns.map((column, index) => (
          <TableCell
            align={column.align}
            sx={{
              width: column.width,
              cursor: column.sortOrder ? 'pointer' : 'auto',
            }}
            key={index}
            variant="head"
            onClick={() => onSortClickHandle(column)}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent={
                column.align === EAlign.RIGHT ? 'center' : 'flex-start'
              }
            >
              <Typography variant="body2" sx={{ mr: 1 }}>
                {column.value}
              </Typography>
              {renderIcon(column)}
            </Box>
          </TableCell>
        ))}
      </TableRow>
    </MUITableHead>
  )
}

export default TableHead
