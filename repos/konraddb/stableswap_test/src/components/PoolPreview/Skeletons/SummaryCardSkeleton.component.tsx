import React from 'react'

import { Skeleton, Box } from '@mui/material'

const SummaryCardSkeleton: React.FC = () => {
  return (
    <Box mt={2} ml={2}>
      <Box marginBottom={2}>
        <Skeleton variant="rectangular" width={215} height={57} />
      </Box>
      <Box marginBottom={2}>
        <Skeleton variant="rectangular" width={215} height={57} />
      </Box>
    </Box>
  )
}
export default SummaryCardSkeleton
