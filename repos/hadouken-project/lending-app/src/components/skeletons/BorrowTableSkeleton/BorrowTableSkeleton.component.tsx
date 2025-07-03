import React from 'react'

import { AssetListSkeleton } from '@hadouken-project/ui'
import { Box, Skeleton } from '@mui/material'

import { BorrowTableSkeletonProps } from './BorrowTableSkeleton.types'

const numberOfElement = [0, 1, 2, 3, 4, 5, 6]

const BorrowTableSkeleton: React.FC<BorrowTableSkeletonProps> = ({
  rowsCount = 4,
  columnsCount = 4,
}) => {
  return (
    <Box
      pt={3}
      sx={{
        bgcolor: (theme) => theme.palette.primary.main,
        boxShadow: (theme) => `6px 6px 0px ${theme.palette.common.black}`,
      }}
    >
      <Box
        display="flex"
        width="100%"
        paddingX={3}
        paddingBottom={3}
        bgcolor={(theme) => theme.palette.primary.main}
      >
        {numberOfElement.map((index) => (
          <Box key={index} width="100%">
            <Skeleton height={16} width={112} variant="rectangular" />
            <Box pt={1}>
              <Skeleton height={16} width={56} variant="rectangular" />
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        paddingX={3}
        paddingBottom={3}
        bgcolor={(theme) => theme.palette.primary.main}
      >
        <AssetListSkeleton rowsCount={rowsCount} columnsCount={columnsCount} />
      </Box>
    </Box>
  )
}

export default BorrowTableSkeleton
