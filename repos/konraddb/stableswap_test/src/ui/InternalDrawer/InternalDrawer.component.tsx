import React from 'react'

import { Button, CloseIcon } from '@hadouken-project/ui'
import { Box, Typography } from '@mui/material'

import { messages } from './InternalDrawer.messages'
import { Drawer } from './InternalDrawer.styled'
import { IInternalDrawerProps } from './InternalDrawer.types'

const InternalDrawer: React.FC<IInternalDrawerProps> = (props) => {
  const { header, subheader, children, toggleDrawer } = props

  return (
    <Drawer>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4Bold">{header}</Typography>
        {toggleDrawer && (
          <Button
            text={messages.BUTTON_LABEL}
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<CloseIcon />}
            onClick={toggleDrawer}
          ></Button>
        )}
      </Box>
      <Typography variant="paragraphMedium" sx={{ mt: 1, opacity: 0.7 }}>
        {subheader}
      </Typography>
      {children}
    </Drawer>
  )
}

export default InternalDrawer
