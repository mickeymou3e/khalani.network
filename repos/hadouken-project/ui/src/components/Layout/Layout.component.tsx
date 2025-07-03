import React, { PropsWithChildren } from 'react'

import Box from '@mui/material/Box'

const Layout: React.FC<PropsWithChildren> = ({ children }) => (
  <Box display="flex" width="100%" justifyContent="center">
    <Box
      sx={{ width: { xs: '100%', xl: '1920px' } }}
      marginX={{
        xl: 9,
        lg: 3,
        md: 4,
        xs: 2,
      }}
      marginBottom={3}
    >
      {children}
    </Box>
  </Box>
)

export default Layout
