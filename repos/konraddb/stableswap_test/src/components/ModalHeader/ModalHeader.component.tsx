import React from 'react'

import { ReactComponent as CloseIcon } from '@assets/close.svg'
import { Box, CircularProgress, Typography, useTheme } from '@mui/material'

import { IModalHeaderProps } from './ModalHeader.types'

const ModalHeader: React.FC<IModalHeaderProps> = ({
  title,
  icon,
  showLoader,
  onClose,
}) => {
  const { spacing, palette } = useTheme()

  return (
    <Box>
      <Box display="flex">
        <CloseIcon
          onClick={onClose}
          fill={palette.text.primary}
          width={24}
          height={24}
          style={{
            cursor: 'pointer',
            marginLeft: 'auto',
          }}
        />
      </Box>

      <Box display="flex" justifyContent="center">
        <Box display="grid" justifyItems="center">
          {showLoader && (
            <CircularProgress
              style={{ marginBottom: spacing(3) }}
              color="primary"
            />
          )}
          {!showLoader && (
            <img
              style={{ height: 48, width: 48, marginBottom: spacing(2) }}
              src={icon}
            />
          )}
          <Typography variant="h5">{title}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default ModalHeader
