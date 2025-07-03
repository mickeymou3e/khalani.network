import React from 'react'

import { Skeleton } from '@mui/material'

const SearchBoxSkeleton: React.FC = () => {
  return (
    <Skeleton
      variant="rectangular"
      sx={{ borderRadius: 8 }}
      width="100%"
      height={50}
    />
  )
}

export default SearchBoxSkeleton
