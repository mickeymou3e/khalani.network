import { Box } from '@mui/material'

import React from 'react'

const Layout: React.FC = ({ children }) => {
  return <Box marginX="auto">{children}</Box>
}

export default Layout
