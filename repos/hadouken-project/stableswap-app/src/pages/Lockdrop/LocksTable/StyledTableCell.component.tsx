import React from 'react'

import { TableCell, Typography } from '@mui/material'

import { StyledTableCellProps } from '../Lockdrop.types'

export const StyledTableCell: React.FC<StyledTableCellProps> = ({
  text,
  width,
}) => {
  return (
    <TableCell
      width={width}
      align="center"
      sx={(theme) => ({
        border: `1px solid ${theme.palette.background.backgroundBorder}`,
        padding: '8px',
        color: 'inherit',
      })}
    >
      <Typography variant="paragraphTiny">{text}</Typography>
    </TableCell>
  )
}
