import React from 'react'

import { Box, Typography } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import MUITableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import { EAlign, TableHeadProps } from './Table.types'

const TableHead: React.FC<TableHeadProps> = (props) => {
  const { columns, displayHeader } = props

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
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent={
                column.align === EAlign.RIGHT ? 'center' : 'flex-start'
              }
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mr: 1 }}
              >
                {column.value}
              </Typography>
            </Box>
          </TableCell>
        ))}
      </TableRow>
    </MUITableHead>
  )
}

export default TableHead
