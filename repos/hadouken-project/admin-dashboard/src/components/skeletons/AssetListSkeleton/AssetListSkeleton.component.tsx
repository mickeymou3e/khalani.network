import React from 'react'

import { Box, Skeleton } from '@mui/material'

import { AssetListSkeletonProps } from './AssetListSkeleton.types'

const AssetListSkeleton: React.FC<AssetListSkeletonProps> = ({
  rowsCount = 4,
  height = 75,
}) => {
  const rows = Array.from(Array(rowsCount).keys())

  return (
    <Box>
      {rows.map((index) => (
        <Skeleton
          key={index}
          sx={{ marginTop: 1 }}
          variant="rectangular"
          width="100%"
          height={height}
        />
      ))}
    </Box>
  )
}

export default AssetListSkeleton
