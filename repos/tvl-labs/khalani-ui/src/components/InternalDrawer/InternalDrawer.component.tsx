import React from 'react'

import { CloseIcon } from '@components/icons'
import { Box, Divider, Typography } from '@mui/material'

import { CustomizedCloseButton, Drawer } from './InternalDrawer.styled'
import { IInternalDrawerProps } from './InternalDrawer.types'

const InternalDrawer: React.FC<IInternalDrawerProps> = (props) => {
  const { header, subheader, children, handleCloseClick } = props

  return (
    <Drawer elevation={2} sx={{ zIndex: 2, border: 'none' }}>
      <Box p={2}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h6">{header}</Typography>
            <Typography variant="body2" color="text.secondary">
              {subheader}
            </Typography>
          </Box>
          <CustomizedCloseButton onClick={handleCloseClick}>
            <CloseIcon />
          </CustomizedCloseButton>
        </Box>

        <Divider sx={{ mt: 2 }} />
        {children}
      </Box>
    </Drawer>
  )
}

export default InternalDrawer
