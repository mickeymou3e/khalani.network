import React from 'react'

import InfoIcon from '@mui/icons-material/Info'
import { Box, Tooltip, Typography } from '@mui/material'

import { IPoolParameterProps } from './PoolParameter.types'

const PoolParameter: React.FC<IPoolParameterProps> = ({
  name,
  description,
  children,
}) => {
  return (
    <Box display="flex" flexDirection="column" justifyContent="center">
      <Box display="flex" marginBottom={1}>
        <Typography variant="caption" component="p" color="primary">
          <b>{name.toUpperCase()}</b>
        </Typography>
        {description && (
          <Box marginLeft={1} display="flex">
            <Tooltip title={description}>
              <InfoIcon />
            </Tooltip>
          </Box>
        )}
      </Box>
      <Box>{children}</Box>
    </Box>
  )
}

export default PoolParameter
