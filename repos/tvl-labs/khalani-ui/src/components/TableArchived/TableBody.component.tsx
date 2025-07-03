import React from 'react'

import Link, { LinkEnum } from '@components/Link'
import { PendingIcon } from '@components/icons'
import { Box, Typography } from '@mui/material'
import MUITableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

import { TableBodyProps } from './Table.types'

const TableBody: React.FC<TableBodyProps> = ({
  rows,
  columns,
  isLoading,
  redirectPath,
  RouterLink,
  handleRowClick,
}) => {
  const alignments = columns.map((column) => column.align)

  return (
    <MUITableBody>
      {rows?.map((row) => {
        return (
          <TableRow
            key={row.id}
            data-testid={row.id}
            sx={{
              cursor: 'pointer',
            }}
            hover
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
                }}
                onClick={() => handleRowClick?.(row.id)}
              >
                <Link
                  linkType={LinkEnum.Internal}
                  url={`${redirectPath}/${row.id}`}
                  RouterLink={RouterLink}
                  underline="none"
                  color="text.primary"
                >
                  <Box p={1}>
                    {typeof row.cells[cell.name] === 'string' || 'number' ? (
                      <Typography variant="body2" component="div">
                        {row.cells[cell.name]?.value}
                      </Typography>
                    ) : (
                      row.cells[cell.name]?.value
                    )}
                  </Box>
                </Link>
              </TableCell>
            ))}
          </TableRow>
        )
      })}
      {isLoading && (
        <TableRow>
          <TableCell colSpan={12}>
            <Box
              display="flex"
              alignItems="center"
              p={3}
              flexDirection="column"
            >
              <PendingIcon style={{ width: 48, height: 48 }} />
              <Typography variant="button" sx={{ mt: 1 }}>
                Loading...
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
      )}
      {rows?.length === 0 && !isLoading && (
        <TableRow>
          <TableCell colSpan={12}>
            <Box
              display="flex"
              alignItems="center"
              p={3}
              flexDirection="column"
            >
              <Typography variant="button">No data</Typography>
            </Box>
          </TableCell>
        </TableRow>
      )}
    </MUITableBody>
  )
}

export default TableBody
