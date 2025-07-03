import React from 'react'

import { Button, Table } from '@hadouken-project/ui'
import { Box, Skeleton, Typography } from '@mui/material'

import { PoolCommonTableProps } from './PoolCommonTable.types'

const Skeletons = new Array(5)
  .fill(null)
  .map((_, index) => (
    <Skeleton
      key={index}
      sx={{ marginTop: '8px' }}
      variant="rectangular"
      width="100%"
      height={60}
    />
  ))

export const PoolCommonTable: React.FC<PoolCommonTableProps> = ({
  columns,
  rows,
  isFetching,
  hasMore,
  transactionsAmount,
  message,
  loadMoreTransactions,
}) => {
  return (
    <>
      <Table columns={columns} rows={rows} />
      {isFetching && <Box>{Skeletons}</Box>}

      <Box textAlign="center" mt={3}>
        {!isFetching && hasMore && transactionsAmount !== 0 && (
          <Button
            text="Load more results"
            variant="contained"
            size="medium"
            onClick={loadMoreTransactions}
          />
        )}

        {!isFetching && transactionsAmount === 0 && (
          <Typography variant="paragraphMedium" sx={{ opacity: '0.7' }}>
            {message}
          </Typography>
        )}
      </Box>
    </>
  )
}
