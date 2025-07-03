import React from 'react'

import { Box } from '@mui/material'

const ModuleLayout: React.FC = ({ children }) => {
  return <Box my={4}>{children}</Box>
}

export default ModuleLayout
