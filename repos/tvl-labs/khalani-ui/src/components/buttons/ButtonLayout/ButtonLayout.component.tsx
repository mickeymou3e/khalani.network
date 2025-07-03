import React from 'react'

import Box from '@mui/material/Box'
import { BoxProps } from '@mui/system'

const ButtonLayout: React.FC<BoxProps> = ({ children, sx, ...rest }) => (
  <Box
    {...rest}
    sx={{
      '& >*:not(:last-child)': {
        marginRight: { xs: 0, sm: 2 },
        marginBottom: { xs: 2, sm: 0 },
      },
      ...sx,
    }}
    display="flex"
    flexDirection={{ xs: 'column', sm: 'row' }}
    justifyContent={{ xs: 'center', md: 'end' }}
  >
    {children}
  </Box>
)

export default ButtonLayout
