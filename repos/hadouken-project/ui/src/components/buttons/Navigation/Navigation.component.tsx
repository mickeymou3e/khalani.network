import React from 'react'

import { Typography } from '@mui/material'
import MUIButton from '@mui/material/Button'

import { INavigationProps } from './Navigation.types'

const Navigation: React.FC<INavigationProps> = ({ text, sx, onClick }) => {
  return (
    <MUIButton
      sx={{
        ...sx,
        width: '100%',
      }}
      onClick={onClick}
      variant="text"
    >
      <Typography variant="paragraphMedium">{text}</Typography>
    </MUIButton>
  )
}

export default Navigation
