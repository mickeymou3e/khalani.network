import React from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { IModalHeaderProps } from './ModalHeader.types'

const ModalHeader: React.FC<IModalHeaderProps> = ({ title }) => (
  <Box>
    <Box display="flex" justifyContent="start">
      <Typography textAlign="left" variant="h4Bold">
        {title}
      </Typography>
    </Box>
  </Box>
)

export default ModalHeader
