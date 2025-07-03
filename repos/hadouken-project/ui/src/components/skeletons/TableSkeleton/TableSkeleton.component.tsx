import React, { useCallback } from 'react'

import { Box, Skeleton } from '@mui/material'

import { SKELETON_ROWS_COUNT } from './TableSkeleton.constants'
import { ITableSkeletonProps } from './TableSkeleton.types'

const TableSkeleton: React.FC<ITableSkeletonProps> = ({
  columns,
  rowsCount = SKELETON_ROWS_COUNT,
}) => {
  const cells = columns.map((column, index) => (
    <Box
      key={index}
      display="flex"
      justifyContent={column.align}
      width={column.width}
    >
      <Box display="inline-flex" alignItems="center" width={100} height={22}>
        <Skeleton variant="text" width={100} height={30} />
      </Box>
    </Box>
  ))

  const getRows = useCallback(() => {
    const rows = Array.from(Array(rowsCount).keys())

    return rows.map((index) => {
      return (
        <Skeleton
          key={index}
          sx={{ marginTop: 1 }}
          variant="rectangular"
          width="100%"
          height={75}
        />
      )
    })
  }, [rowsCount])

  const rows = getRows()

  return (
    <Box>
      <Box padding={2} display="flex">
        {cells}
      </Box>

      {rows}
    </Box>
  )
}

export default TableSkeleton
