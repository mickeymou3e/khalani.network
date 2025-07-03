import React from 'react'

import { Box, Typography } from '@mui/material'
import MUIButton from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'

import { IIconButtonProps } from './IconButton.types'

const IconButton: React.FC<IIconButtonProps> = ({ icon, text, ...rest }) => {
  const { spacing } = useTheme()

  return (
    <MUIButton
      color="primary"
      variant="outlined"
      style={{ borderRadius: spacing(0.5) }}
      {...rest}
    >
      <Box display="flex" alignItems="end">
        <img
          style={{ height: 24, width: 16, marginRight: 12, color: 'white' }}
          src={icon}
        />
        <Typography variant="paragraphMedium" style={{ textTransform: 'none' }}>
          {text}
        </Typography>
      </Box>
    </MUIButton>
  )
}

export default IconButton
