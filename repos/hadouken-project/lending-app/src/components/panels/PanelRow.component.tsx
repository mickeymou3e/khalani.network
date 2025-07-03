import React from 'react'

import { Box, Typography } from '@mui/material'

interface PanelRowProps {
  factor: string
  value: string
}

export const PanelRow: React.FC<PanelRowProps> = ({ factor, value }) => (
  <Box
    display="flex"
    flexDirection={{ xs: 'row', md: 'column' }}
    gap={1}
    justifyContent="space-between"
  >
    <Typography
      variant="paragraphTiny"
      color={(theme) => theme.palette.text.secondary}
    >
      {factor}
    </Typography>
    <Typography variant="paragraphMedium">{value}</Typography>
  </Box>
)
