import React from 'react'

import { Box, Typography } from '@mui/material'

import { EmptyPanelProps } from './EmptyPanel.types'

export const EmptyPanel: React.FC<EmptyPanelProps> = ({
  text,
  sx,
  ...rest
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 6,
      ...sx,
    }}
    elevation={2}
    {...rest}
  >
    <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
      <Typography color={(theme) => theme.palette.text.secondary} variant="h2">
        {text}
      </Typography>
    </Box>
  </Box>
)
