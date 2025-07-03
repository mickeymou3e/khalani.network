import React from 'react'

import { Typography } from '@mui/material'
import MUITableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

import { TableBodyProps } from './Table.types'

const TableBody: React.FC<TableBodyProps> = ({ rows, columns, onRowClick }) => {
  const alignments = columns.map((column) => column.align)
  return (
    <MUITableBody>
      {rows?.map((row) => {
        return (
          <TableRow
            key={row.id}
            data-testid={row.id}
            sx={{
              cursor: onRowClick ? 'pointer' : 'inherit',
            }}
            hover
            onClick={() => onRowClick?.(row.id)}
          >
            {columns.map((cell, subIndex) => (
              <TableCell
                align={
                  alignments[
                    subIndex >= alignments.length
                      ? alignments.length - 1
                      : subIndex
                  ]
                }
                key={subIndex}
                variant="body"
                sx={{
                  width: cell.width,
                  paddingY: 2,
                  paddingX: 3,
                }}
              >
                {typeof row.cells[cell.name] === 'string' || 'number' ? (
                  <Typography variant="paragraphMedium" component="div">
                    {row.cells[cell.name]?.value}
                  </Typography>
                ) : (
                  row.cells[cell.name]?.value
                )}
              </TableCell>
            ))}
          </TableRow>
        )
      })}
    </MUITableBody>
  )
}

export default TableBody
