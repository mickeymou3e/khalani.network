import React from 'react'

import { Skeleton, Box, useMediaQuery } from '@mui/material'
import { Theme } from '@mui/material/styles'

const PoolDataSkeleton: React.FC = () => {
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  return (
    <Box display="flex" pt={2}>
      <Box>
        <Skeleton width={200} height={25} />
        <Skeleton width={isDesktop ? 355 : 290} height={25} />
        <Box display="flex" mt={2}>
          <Box mr={4}>
            <Box>
              <Skeleton width={50} />
              <Skeleton width={100} />
            </Box>
            <Box pt={1}>
              <Skeleton width={50} />
              <Skeleton width={100} />
            </Box>
          </Box>

          <Box>
            <Box>
              <Skeleton width={50} />
              <Skeleton width={100} />
            </Box>
            <Box pt={1}>
              <Skeleton width={50} />
              <Skeleton width={100} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default PoolDataSkeleton
