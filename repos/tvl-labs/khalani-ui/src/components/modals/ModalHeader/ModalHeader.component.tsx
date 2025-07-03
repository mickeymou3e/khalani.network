import React from 'react'

import { CloseIcon } from '@components/icons'
import { IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { IModalHeaderProps } from './ModalHeader.types'

const ModalHeader: React.FC<IModalHeaderProps> = ({ title, handleClose }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Typography textAlign="left" variant="subtitle2" color="text.secondary">
      {title}
    </Typography>
    <IconButton sx={{ p: 0 }} onClick={handleClose}>
      <CloseIcon />
    </IconButton>
  </Box>
)

export default ModalHeader
