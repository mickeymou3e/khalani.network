import React from 'react'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

export interface ModuleTitleProps {
  title: string
  subtitle?: string
}

const ModuleTitle: React.FC<ModuleTitleProps> = ({ title, subtitle }) => {
  return (
    <Box marginY={1}>
      <Typography variant="h2" color="textPrimary">
        {title}
      </Typography>

      {subtitle && <Typography variant="paragraphSmall">{subtitle}</Typography>}
      <Box paddingY={0.5}>
        <Divider />
      </Box>
    </Box>
  )
}

export default ModuleTitle
