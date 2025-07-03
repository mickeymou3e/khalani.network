import React from 'react'

import { IChildren } from '@interfaces/children'
import Box from '@mui/material/Box'

const Layout: React.FC<IChildren> = ({ children }) => (
  <Box
    display="flex"
    width="100%"
    justifyContent="center"
    minHeight="calc(100vh - 162px)"
  >
    <Box
      sx={{ width: { xs: '100%', xl: '1920px' } }}
      marginX={{
        xl: 5,
        lg: 3,
        md: 4,
        xs: 2,
      }}
    >
      {children}
    </Box>
  </Box>
)

export default Layout
