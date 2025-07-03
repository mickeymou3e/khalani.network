import React from 'react'

import { Skeleton, Box } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

const TokensDataSkeleton: React.FC = () => {
  const { palette } = useTheme()

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        width="100%"
      >
        <Box
          display="flex"
          flexDirection="row"
          width="100%"
          border={`3px solid ${alpha(palette.primary.main, 0.2)}`}
        >
          <Skeleton variant="rectangular" width="100%" height={50} />
        </Box>
      </Box>
    </>
  )
}

export default TokensDataSkeleton
