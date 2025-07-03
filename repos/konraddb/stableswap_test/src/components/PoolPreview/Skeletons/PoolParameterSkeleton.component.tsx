import React from 'react'

import { Skeleton, Box } from '@mui/material'

const PoolParameterSkeleton: React.FC = () => {
  return (
    <Box
      display="flex"
      width="100%"
      flexDirection="column"
      alignContent="center"
    >
      <Box display="flex" marginBottom={1} alignItems="center">
        <Skeleton width="70%" />
        <Box ml={0.5}>
          <Skeleton variant="circular" width={20} />
        </Box>
      </Box>
      <Skeleton width="40%" />
    </Box>
  )
}

export default PoolParameterSkeleton
