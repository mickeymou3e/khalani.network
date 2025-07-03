import React from 'react'

import Slider from '@components/Slider'
import { Box, Paper, Typography } from '@mui/material'

import { messages } from './ProportionalWithdraw.messages'
import { IProportionalWithdrawProps } from './ProportionalWithdraw.types'

const ProportionalWithdraw: React.FC<IProportionalWithdrawProps> = (props) => {
  const { value, onChange } = props

  return (
    <Paper elevation={3} sx={{ p: 2, pt: 3 }}>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="body2" color="text.secondary">
          {messages.LABEL}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {value}%
        </Typography>
      </Box>
      <Slider value={value} onChange={onChange} />
    </Paper>
  )
}

export default ProportionalWithdraw
