import React from 'react'

import InfoIcon from '@mui/icons-material/Info'
import { Box, Button, Tooltip, Typography } from '@mui/material'

import { IPoolParameterButtonProps } from './PoolParameter.types'

const PoolParameter: React.FC<IPoolParameterButtonProps> = ({
  name,
  description,
  children,
  disabled,
  onClick,
}) => {
  return (
    <Button
      variant="text"
      fullWidth
      onClick={onClick}
      style={{ height: 'auto', display: 'inherit', padding: 0 }}
      disabled={disabled}
    >
      <div>
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
      </div>
    </Button>
  )
}

export default PoolParameter
