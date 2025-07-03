import React from 'react'

import { Box, Tooltip, Typography } from '@mui/material'

import { IValueLabelProps } from '.'

const ValueLabel: React.FC<IValueLabelProps> = ({ value, label }) => {
  return (
    <Tooltip title={`${value} ${label ?? ''}`}>
      <Box display="flex" alignItems="center">
        <Typography
          variant="paragraphSmall"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {value}
        </Typography>
        {label && (
          <Typography variant="paragraphSmall">&nbsp;{label}</Typography>
        )}
      </Box>
    </Tooltip>
  )
}
export default ValueLabel
