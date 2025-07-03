import React from 'react'

import { Typography } from '@mui/material'

import { Drawer } from './InternalDrawer.styled'
import { IInternalDrawerProps } from './InternalDrawer.types'

const InternalDrawer: React.FC<IInternalDrawerProps> = (props) => {
  const { header, subheader, children } = props

  return (
    <Drawer>
      <Typography variant="h4Bold">{header}</Typography>
      <Typography variant="paragraphMedium" sx={{ mt: 1, opacity: 0.7 }}>
        {subheader}
      </Typography>
      {children}
    </Drawer>
  )
}

export default InternalDrawer
