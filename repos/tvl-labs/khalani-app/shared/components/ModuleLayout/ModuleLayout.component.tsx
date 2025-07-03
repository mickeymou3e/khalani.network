import React from 'react'

import { IChildren } from '@interfaces/children'
import { Box } from '@mui/material'

const ModuleLayout: React.FC<IChildren> = ({ children }) => {
  return (
    <Box mx={1} py={2} height="100%">
      {children}
    </Box>
  )
}

export default ModuleLayout
